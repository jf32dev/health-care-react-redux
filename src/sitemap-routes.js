import React from 'react';
import { Route } from 'react-router';
 
export default (
  <Route>
    <Route path='/about' priority="0.8" />
    <Route path='/contact' priority="0.8" />
    <Route path='/faqs' priority="0.8" />
    <Route path='/privacy-policy' priority="0.8" />
    <Route path='/terms-and-conditions' priority="0.8" />
    <Route path='/articles' priority="0.8" />
    <Route path='/article/:id' priority="0.8" />
    <Route path='/subscribe' priority="0.8" />
  </Route>
);