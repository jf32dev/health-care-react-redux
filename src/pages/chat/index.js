import React from "react";
import './chat.scss';
import { connect } from 'react-redux';
import { getDoctors, getPatients } from '../../redux/actions';
import moment from 'moment';
import { db } from "../../utils/firebase";
import firebase from "firebase";
import { 
	requestChat as requestchatApi,
	closeChat as closechatApi,
	submitFeedback as submitFeedbackApi
} from '../../api';
import { withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';

import StarRatingComponent from 'react-star-rating-component';
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
class Chat extends React.Component {
	state ={
		data: [],
		chat_menu : "0",
		selected_chat: {
			id: 0
		},
		doctor_selected:{
			id: 0
		},
		message: '',
		search_text: '',
		me:"",
		doctors: [],
		patients:[],
		contact_type : "0",
		request_chat_doctor_id: 0,
		chat_rating:0,
		rating_edit_status:false,
		loading_status:false,
	}
	constructor(props) {
		super(props);
		this.inputRef = React.createRef();
	}
	static getDerivedStateFromProps(props, state) {
		return {
		 me:props.me,
		doctors: props.doctors,
		patients:props.patients,
		};
	}
	componentDidUpdate(prevProps) {
		if (prevProps.doctor_loading && !this.props.doctor_loading) {
			if (this.state.selected_chat.id !== 0) {
				const {doctors,selected_chat} = this.state;
				let doctor_object1 = doctors.find(obj => {	return obj.id === selected_chat.doctor_object.id});
				selected_chat.doctor_object = doctor_object1; 
				this.setState({
					selected_chat
				});
			}
		}
	}
	selectChat = (item) => {
		this.setState({
			selected_chat: item
		})
	}
	selectDoctor = (item) => {
		this.setState({
			doctor_selected:item
		});
	}
	close_chat = async (e) => {
		let room_id = e.target.id;
		this.setState({
			loading_status:true
		})
		await closechatApi(room_id);

	}
	submit_feedback = async (e) => {
		const {chat_rating,selected_chat} = this.state;
		let id = e.target.id;
		let submit_text = document.getElementsByClassName('feedback_text')[id].value;
		await submitFeedbackApi(selected_chat.f_room.doc_id,chat_rating,submit_text,selected_chat.doctor_object.id);
		this.props.getDoctors();
		this.setState({
			chat_rating:0
		})
	
	}
	sendMessage = () => {
		let { message, selected_chat, data,me } = this.state;
		if (message.length === 0) {
			alert("Please input message!");
			return;
		}
		let add_message = message;
		
		let messages = selected_chat.messages;
		let index = data.findIndex(temp => temp.id === selected_chat.id);
		messages.unshift({
			to: selected_chat.user_id,
			message: message,
			createdAt: moment().format('YYYY-MM-DD hh:mm:ss')
		})
		selected_chat.messages = messages;
		data[index].messages = messages;
		db.collection('rooms').doc(selected_chat['f_room']['doc_id']).collection('messages').get().then(sub => {
			db.collection("rooms").doc(selected_chat['f_room']['doc_id']).collection('messages').add({
				text: add_message,
				sender: me.id,
				create_date:firebase.firestore.Timestamp.fromDate(new Date())
			})
			.then(function(docRef) {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch(function(error) {
				console.error("Error adding document: ", error);
			});	
		});
		message = ''
		this.setState({
			message, selected_chat, data
		})
		this.inputRef.current.focus()
	}
	async componentDidMount() {
		this.props.getDoctors();
		this.props.getPatients();
		var rooms = [];
		var self = this;
		this.setState({
			loading_status:true
		})
		db.collection("rooms").onSnapshot(function(querySnapshot) {
			rooms = [];
			querySnapshot.forEach(function(doc) {
				var room = doc.data();
				db.collection("rooms").doc(doc.id).collection("messages").orderBy("create_date")
					.onSnapshot(function(querySnapshot1) {
						var messages = [];
						querySnapshot1.forEach(function(doc1) {
							messages.push(doc1.data());
						});
						room['messages']=messages;
						room['doc_id']=doc.id;
						self.update_chat(messages, doc.id);
					});
				rooms.push(room);
			});
			setTimeout(function () {
				rooms.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds)
				self.updateRooms(rooms);
				
			}, 3000);
		});
	  }
	updateRooms = (rooms) => {
		const {me,request_chat_doctor_id, doctors, patients} = this.state;
		let user_id_type = me.type === 0 ? "user_id" : "doctor_id";
		let data = [];
		let selected_chat = {id:0};
			for(let i=0; i<rooms.length; i++){
				if(rooms[i][user_id_type]===me.id){
					let chats = {};
					let messages = [];
					chats.id = i+1;
					chats.user_id = me.id;
					let user_object = me.type === 0 ? doctors.find(obj => {	return obj.id === rooms[i]["doctor_id"]}) : patients.find(obj => {	return obj.id === rooms[i]["user_id"]});
					chats.name = user_object.first_name + " "+user_object.last_name;
					chats.doctor_object = user_object;
					chats.f_room = rooms[i];
					chats.avatar = user_object.photo || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png";
					chats.status = rooms[i]['status'];
					for(let j=0; j<rooms[i]['messages'].length; j++){
						let message = {};
						message.message = rooms[i]['messages'][j].text;
						message.to = rooms[i].messages[j].sender;
						let d = new Date(rooms[i]['messages'][j].create_date['seconds'] * 1000 + rooms[i]['messages'][j].create_date['nanoseconds']/1000000);
						let date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
						message.createdAt = date;
						messages.push(message);
					}
					messages.sort((a, b) => (new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : -1)
					chats.messages = messages;
					data.push(chats);
					if(chats['f_room']['doc_id']===request_chat_doctor_id){
						selected_chat = chats;
					}
				}
			}
			this.setState({
				data:data,
				selected_chat:selected_chat,
				contact_type:"0",
				doctor_selected:{id:0},
				loading_status:false
			})
	};
	onStarClick(nextValue, prevValue, name) {
		this.setState({chat_rating: nextValue});
	}
	change_chattype = (e) =>{
		let contact_type = e.target.id;
		let {selected_chat,doctor_selected} = this.state;
		if(contact_type==="1")
			selected_chat={id:0};
		else
			doctor_selected={id:0}
		this.setState({
			contact_type, selected_chat, doctor_selected
		})
	};
	request_chat = async (e) => {
		this.setState({
			loading_status:true
		})
		let request_chat_id = e.target.id;
		try {
			const result = await requestchatApi(request_chat_id);
			if (result.errors && result.errors.length > 0) {
				this.props.enqueueSnackbar(result['errors'][0]['message'], { variant: 'error' });
			} else {
				this.setState({
					request_chat_doctor_id:result['data']['room_id'],		
				})
			}
		} catch(err) {
			console.log("ERR", err)
		} finally {
			this.setState({
				loading_status:false
			})
		}
	};

	renderChatFeedback = () => {
		const { selected_chat, chat_rating } = this.state;
		const index = selected_chat.doctor_object.feedbacks.findIndex(temp => temp.chat_id === selected_chat.f_room.doc_id);
		if (index > -1) {
			let myFeedback = selected_chat.doctor_object.feedbacks[index];
			return (
				<div className="feedback-row" key={index}>
					<div className="show_review">
						<div className="given_patient_detail">
							<img src = {myFeedback.patient.photo} width="30px" alt="" />
						</div>
						<StarRatingComponent 
							name="rate1" 
							starCount={5}
							value={myFeedback.rating}
							editing={false}
						/>
					</div>
					<div style={{textAlign:"left",fontWeight:"600",marginTop:"15px"}}>
						<span>{myFeedback.description}</span>
						
					</div>
					<div style={{textAlign:"left",fontWeight:"500",marginTop:"15px"}}>
						<label style={{marginRight:"15px"}}>{myFeedback.patient.first_name+" "+myFeedback.patient.last_name}</label>
						<label>{moment(myFeedback.createdAt).format('lll')}</label>
					</div>
				</div>);
		} else {
			return (
				<div className="row1">
					<div className="show_review">
						<StarRatingComponent 
							name="rate1" 
							starCount={5}
							value={chat_rating}
							editing={true}
							onStarClick={this.onStarClick.bind(this)}
						/>
					</div>
					<div>
						<textarea placeholder="Type your feedback..." className="form-control feedback_text"></textarea>
						<button className="feedback_submit btn btn-success" id="0" onClick={this.submit_feedback} >Submit</button>
					</div>
				</div>
			)
		}
	}
	update_chat = (messages,doc_id) => {
		let update_messages = [];
		const {data } = this.state;
		for(let i=0; i<data.length; i++){
			if(data[i]['f_room']['doc_id']===doc_id){
				for(let j=0; j<messages.length; j++){
					let message = {};
					message.message = messages[j].text;
					// message.to = messages[j].sender === me.id ? 1 : 0;
					message.to = messages[j].sender;
					let d = new Date(messages[j].create_date['seconds'] * 1000 + messages[j].create_date['nanoseconds']/1000000);
					let date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
					message.createdAt = date;
					update_messages.push(message);
				}
				update_messages.sort((a, b) => (new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : -1)
					
				data[i]['messages'] = update_messages;
			}
		}
		this.setState({
			data:data
		})
	};
	_handleKeyDown = (e) => {
		if (e.key === 'Enter') {
				e.preventDefault();
				this.sendMessage();
		}
	}

	checkPayment = () => {
		const info = this.props.payment_info || {};
		return Object.keys(info).length > 0;
	}

	renderSubscribeContent = () => {
		return (
			<div className="suggestion v-r">
				<h4>Subscribe to chat with our Afib Experts</h4>
				<NavLink to="/admin/subscribe" className="v-c h-c">Subscribe</NavLink>
				<h4>Chat With An Expert Service</h4>
				<p>
					By signing up for this added feature, users can chat with an Afib expert about any Afib related question. 
					Our experts can explain the disease in greater detail or break it down into simpler and easier to understand nonscientific language.
					Besides educating our club members and clearing up misconceptions about Afib, experts can walk you through complex procedures like ablations or left atrial occlusion devices, and even discuss clinical research trials available in your area.
					No personal diagnosis or treatment advice will be given since only your physician knows your medical information and should offer you personal medical advice.
				</p>
			</div>
		)
	}

  render() {
		const { me } = this.props
		const { selected_chat, message, data, search_text,contact_type,doctors, doctor_selected ,loading_status} = this.state;
		const filtered = data.filter(item => item.name.toLowerCase().indexOf(search_text.toLowerCase()) > -1) || [];
		const filtered_doctor = doctors.filter(item => item.first_name.toLowerCase().indexOf(search_text.toLowerCase()) > -1) || [];
			
		return (
			<div className="chat_content">
				<Helmet> <meta name="description" content="Talk to experts" /> </Helmet>
				<div className={`loading-gif ${loading_status ? "loading_show" : ""}`}></div>
				<div className={`contact-menu ${selected_chat.id > 0 ? 'chat_selected' : ''} ${doctor_selected.id > 0 ? 'chat_selected' : ''}`}>
					<div className={`contact_type ${me.type === 1 ? 'contact_type_none' : ""}`}>
						<button className={`contact_chat btn ${contact_type==="0" ? "contact_focus" : ""} `} id="0" onClick={this.change_chattype}><i className="far fa-comments" aria-hidden="true"></i> Chats</button>
						<button className={`contact_doctor btn  ${contact_type==="1" ? "contact_focus" : ""} `} id="1" onClick={this.change_chattype}><i className="fa fa-user-md" aria-hidden="true"></i> Experts</button>
					</div>
					
					{((contact_type === "0" && data.length > 0) || (contact_type === "1" && this.checkPayment())) && <input className="form-control search_contact" placeholder="Search..." value={search_text} onChange={e => this.setState({search_text: e.target.value})}/>}
					{(data.length > 0 || (data.length === 0 && this.checkPayment())) ? <div className={`contacts ${contact_type === "1" ? 'contact_type_none' : ""}`}>
						{filtered.map((item, index) => <div className={`chat-item ${item.id === selected_chat.id ? 'selected' :''}`} key={index} onClick={e => this.selectChat(item)}>
							<img src={item.avatar} alt="" />
							<div className="information">
								<p>{item.name}</p>
								{item.messages.length > 0 && <p className="last-message">{item.messages[0].message}</p>}
							</div>
						</div>)}
					</div> : <div className={`contacts show-mobile ${contact_type === "1" ? 'contact_type_none' : ""}`}>
						{this.renderSubscribeContent()}
					</div>}
					{this.checkPayment() ? <div className={`contacts_doctor ${contact_type === "0" ? 'contact_type_none' : ""}`}>
						{filtered_doctor.map((item, index) => <div className={`chat-item ${item.id === doctor_selected.id ? 'selected' :''}`} key={index} onClick={e => this.selectDoctor(item)}>
							<img src={item.photo} alt="" />
							<div className="information">
								<p>{item.first_name+" "+item.last_name}</p>
							</div>
						</div>)}
					</div> : <div className={`contacts_doctor show-mobile ${contact_type === "0" ? 'contact_type_none' : ""}`}>
						{this.renderSubscribeContent()}
					</div>}
				</div>
				{(selected_chat.id === 0 && doctor_selected.id === 0 && !this.checkPayment()) && <div className="chat-area show-web-flex">
					{(contact_type === "1" || (contact_type === "0" && data.length === 0)) && this.renderSubscribeContent()}
				</div>}
				{selected_chat.id > 0 && <div className="chat-area">
					<div className="chat-opponent">
						<div className="return-arrow" onClick={e => {this.setState({selected_chat: { id: 0 }})}}>
							<i className="zmdi zmdi-long-arrow-left"></i>
						</div>
						<img src={selected_chat.avatar} alt="" />
						<p>{selected_chat.name}</p>
						<button className={`btn btn-primary btn-close-chat ${selected_chat.status === 1 ? 'contact_type_none' : ""}  ${me.type === 0 ? 'contact_type_none' : ""} `} id={selected_chat['f_room']['doc_id']} onClick = {this.close_chat} disabled={selected_chat.status === 1 ? true : false}>Close</button>
					</div>
					<div className="messages-area">
						{selected_chat.messages.map((item, index) => <div className={`message-item ${item.to === selected_chat.user_id ? 'mine' : ''}`} key={index}>
							{item.to !== selected_chat.user_id && <img src={selected_chat.avatar} alt="" />}
							<div className="message-detail">
								<p>
									{item.to !== selected_chat.user_id && <span>{selected_chat.name}, </span>}
									<span>{moment(new Date(item.createdAt.replace(/-/g, "/"))).format('hh:mm A')}</span>
								</p>
								<div className="message-content">{item.message}</div>
							</div>
						</div>)}
					</div>
					{me.type===0 && <div className={`feedback_view ${selected_chat.status=== 0 ? "hide_feedback" : ""} `}>
						<div style={{textAlign:"center",color:"gray"}}>
						<span>--------------------------------------------------------------------------</span>
							<p>Chat Closed</p>
						<span>--------------------------------------------------------------------------</span>
						</div>
						{this.renderChatFeedback()}
					</div>}
					<div className={`message-input ${selected_chat.status=== 1 ? "input_hidden" : ""}`}>
						<input className={`form-control message `} placeholder="Type message..."  value={message} onKeyDown={this._handleKeyDown} onChange={e => this.setState({message: e.target.value})} ref={this.inputRef} />
						<button onClick={this.sendMessage}><i className="zmdi zmdi-mail-send"></i></button>
					</div>
				</div>}

				{doctor_selected.id > 0 && <div className="chat-area">
					<div className="chat-opponent">
						<div className="return-arrow" onClick={e => {this.setState({doctor_selected: { id: 0 }})}}>
							<i className="zmdi zmdi-long-arrow-left"></i>
						</div>
						<img src={doctor_selected.photo} alt="" />
						<p>{doctor_selected.first_name+" "+doctor_selected.last_name}</p>
					</div>
					<div className="request-area">
						<button className="btn btn-primary request_chat_btn" id={doctor_selected.id} onClick={this.request_chat}> Request Chat </button>
					</div>
					<div className={`feedback_view`}>
						{doctor_selected.feedbacks.map((item, index) => 
						<div className="v-r feedback-row" key={index}>
							<div className="show_review">
								<div className="given_patient_detail">
									<img src = {item.patient.photo} width="30px" alt="" />
								</div>
								<StarRatingComponent 
									name="rate1" 
									starCount={5}
									value={item.rating}
									editing={false}
								/>
							</div>
							<div style={{textAlign:"left",fontWeight:"600",marginTop:"15px"}}>
								<span>{item.description}</span>
								
							</div>
							<div style={{textAlign:"left",fontWeight:"500",marginTop:"15px"}}>
								<label style={{marginRight:"15px"}}>{item.patient.first_name+" "+item.patient.last_name}</label>
								<label>{moment(item.createdAt).format('lll')}</label>
							</div>
						</div>)}
					</div>
				</div>}
			</div>
    );
  }
}
const mapStateToProps = (state) => {
	return {
		me : state.auth.me,
		isLoggedin:state.auth.loggedin,
		doctors: state.doctor.doctors,
		patients:state.patient.patients,

		doctor_loading: state.doctor.loading,
		payment_info: state.subscribe.payment_info
	}
}

export default withRouter(connect(mapStateToProps, { getDoctors, getPatients })(withSnackbar(Chat)));
