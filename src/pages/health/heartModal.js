
import React from "react";
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { addStep,addHeartRate, addWeight, addAlcohol,addHeartPressure , addEnergy, addStand, addExercise, addSleep} from '../../redux/actions';
import {  Button,
  Modal,
  ModalBody,
  ModalHeader,
	ModalFooter,
} from 'reactstrap';

class HeartModal extends React.Component {

    
    state = {
      modalSignup: false,
   
      input_value1: "",
      input_value2: "",
      input_date:"",
      sleep_type:"0"
    }
    
 
  
  addData = () => {
    this.setState({
      modalSignup: !this.state.modalSignup
    })
  } 
 
  handleSubmit = () => {
    if (this.state.input_value1 === "" || this.state.input_date === "")
    {
      this.props.enqueueSnackbar("The date or value input field cannot be empty", { variant: 'error' })
    }
    else
    {
     
     
        if(this.props.type==="Step Count"){
          let data = [{
            steps:this.state.input_value1,
            date:this.state.input_date
          }];
          this.props.addStep(data)
          this.props.enqueueSnackbar("Success!", { variant: 'success' })
        }
        if(this.props.type==="Heart Rate"){
          
          let data = [{
            heart_rate:this.state.input_value1,
            date:this.state.input_date
          }];
          this.props.addHeartRate(data)
          this.props.enqueueSnackbar("Success!", { variant: 'success' })
        }

        if(this.props.type==="Weight"){
         
          let data = [{
            weight:this.state.input_value1,
            date:this.state.input_date
          }];
          this.props.addWeight(data)
          this.props.enqueueSnackbar("Success!", { variant: 'success' })
        }

        if(this.props.type==="Number of drinks"){
          let data = [{
            alcohol:this.state.input_value1,
            date:this.state.input_date
          }];
          this.props.addAlcohol(data)
          this.props.enqueueSnackbar("Success!", { variant: 'success' })
        }

        if(this.props.type==="Energy"){
          let data = [{
            energy:this.state.input_value1,
            date:this.state.input_date
          }];
          this.props.addEnergy(data)
          this.props.enqueueSnackbar("Success!", { variant: 'success' })
        }

        if(this.props.type==="Exercise"){
          let data = [{
            exercise:this.state.input_value1,
            date:this.state.input_date
          }];
          this.props.addExercise(data)
          this.props.enqueueSnackbar("Success!", { variant: 'success' })
        }

        if(this.props.type==="Stand"){
          let data = [{
            stand:this.state.input_value1,
            date:this.state.input_date
          }];
          this.props.addStand(data)
          this.props.enqueueSnackbar("Success!", { variant: 'success' })
        }
        if(this.props.type==="Sleep Time"){
          let data = [{
            start:this.state.input_value1,
            end:this.state.input_value2,
            type:this.state.sleep_type,
          }];
          this.props.addSleep(data)
          this.props.enqueueSnackbar("Success!", { variant: 'success' })
        }
        

        if(this.props.type==="Blood Pressure"){
            if(this.state.input_value2==="" || this.state.input_date === ""){
              this.props.enqueueSnackbar("The date or value input field cannot be empty", { variant: 'error' })
            }
            else{
              let data = [{
                systolic:this.state.input_value1,
                diastolic:this.state.input_value2,
                date:this.state.input_date
              }];
              console.log("DATA", data)
              this.props.addHeartPressure(data)
              this.props.enqueueSnackbar("Success!", { variant: 'success' })
            }
         
        }

        this.setState({
          modalSignup: false,
        })
     
      
    }
  }
  changeDateInput = (e) =>{
        let date = new Date(e.target.value);
        let hour = date.getHours() <10 ? "0"+date.getHours() : date.getHours();
        let month = date.getMonth()<9 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        let day = date.getDate() <10 ? "0"+date.getDate() : date.getDate();
        let add_date = date.getFullYear()+"-"+month+"-"+day+"T"+hour+":00:00.000Z";
    this.setState({
      input_date:add_date
    })
  }
  inputValue1 = (e) =>{
    this.setState({
      input_value1:e.target.value,
    })
  }
  
  inputValue2 = (e) =>{
    this.setState({
      input_value2:e.target.value
    })
  }
  changeSleepType =(e) =>{
    this.setState({
      sleep_type:e.target.value
    })
  }
  modalcontent = () => {
    

    if(this.props.type === "Sleep Time"){
      return(
          <ModalBody>
            <label>Select Sleep Type: </label>
            <select className="form-control select_sleep_type" onChange={this.changeSleepType}>
              <option value="0"> InBed</option>
              <option value="1"> Asleep</option>
            </select>
            <br />
            <label>Start Time:</label>
            <input type="datetime-local" className="form-control " onChange={this.inputValue1} id="1" />
            <label>End Time:</label>
            <input type="datetime-local" className="form-control " onChange={this.inputValue2} id="1" />
            
        </ModalBody>
        );
    }
    else if(this.props.type === "Blood Pressure"){
      return(
        <ModalBody>
             <label>Date Time:</label>
              <input type="datetime-local" className="form-control add_heart_date" onChange={this.changeDateInput} id="1" />
              <br />
              {/* <label>{props.type}:</label> */}
              <label>Systolic</label>
              <input type="number" className="form-control add_heart_value" onChange={this.inputValue1} id="1" />
              <label>Diastolic</label>
              <input type="number" className="form-control add_heart_value" onChange={this.inputValue2}  id="1" />
          </ModalBody>
      );
    }
    else{
      return(
           <ModalBody>
             <label>Date Time:</label>
              <input type="datetime-local" className="form-control add_heart_date" onChange={this.changeDateInput} id="1" />
              <br />
              <label>{this.props.type}:</label>
              <input type="number" className="form-control add_heart_value" onChange={this.inputValue1} id="1" />
          </ModalBody>
      );
    }
  }
  render() {
    return (
        <React.Fragment>
           <Button color="primary" className="manual_add_button" onClick={this.addData}>Add</Button>
          <Modal isOpen={this.state.modalSignup} toggle={this.addData}>
          <ModalHeader toggle={this.addData}>{this.props.type} Add</ModalHeader>
            {this.modalcontent()}
            <ModalFooter>
              <Button color="success" onClick={this.handleSubmit}>Save</Button>
            </ModalFooter>
        </Modal>
      
        
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
   
  }
}

export default connect(mapStateToProps, { addStep,addHeartRate, addWeight, addSleep, addAlcohol,addHeartPressure, addExercise, addEnergy, addStand})(withSnackbar(HeartModal));