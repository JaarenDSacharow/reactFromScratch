import React from 'react';

import PropTypes from 'prop-types'; //no longer to be a part of the core package; must be imported.


class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      buyItems: [ "milk", "bread", "fruit" ],
      message: ""
    }
  }

  //add item method///////////
  addItem (event){
    event.preventDefault(); //to prevent refreshes upon submit
    const {buyItems} = this.state;
    const newItem = this.newItem.value;
    const isOnTheList = buyItems.includes(newItem);
    //dupe validation
    if(isOnTheList) {
      this.setState({
        message: "This item is already on the list."
      })

    } else {
      //make sure there is a value before you setState
      newItem !== "" && this.setState({
        buyItems: [...this.state.buyItems, newItem],
        message: ""
      });
    }

    this.addForm.reset(); //ref to the form to remove the value in the box
  }

  //remove item method
  removeItem (item) {
    //get old state and make a new state by filtering rather than changing the old state
    const newBuyItems = this.state.buyItems.filter(buyItem => {
      return buyItem !== item;  //return only buyItems that do not match item argument
    });

    if(newBuyItems.length === 0){
      this.setState({
        message: "No items.  Add an item."
      })
    }

    this.setState({
      buyItems: [...newBuyItems]
    })
  }

  //clearList
  clearList() {
    this.setState({
      buyItems: [],
      message: "No items.  Add an item."
    })
  }

  //render the component
  render (){
    return (
      <div>
          <header>
            <h1> Shopping List</h1>
            <form ref={(input) => this.addForm = input } className="form-inline" onSubmit={(event) => {this.addItem(event)}}>
              <div className="form-group">
                <label className="sr-only" htmlFor="newItemInput">Add New Item</label>
                <input ref={(input) => this.newItem = input } type="text" placeholder="bread" className="form-control" id="newItemInput" />
              </div>
              <button type="submit" className="btn-btn-primary">Add Item</button>
            </form>
          </header>
          <div className="content">
            {
              this.state.message !=="" &&<p className="errormessage">{this.state.message}</p>
            }

              <table className="table table-striped">
                <tbody>
                  <tr>
                    <th>Item</th>
                    <th>Action</th>
                  </tr>
                  {
                    this.state.buyItems.map(item => {
                      return (
                        <tr key={item}>
                         <td>{item}</td>
                         <td><button onClick={(e)=>this.removeItem(item)}type="button" className="btn btn-default btn-sm">Remove</button></td>
                        </tr>
                      )
                   })
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <td>
                      <button onClick={(e)=>this.clearList()}className="btn btn-default btn-sm">Clear List</button>
                    </td>
                  </tr>
                </tfoot>
              </table>
          </div>
      </div>
    )
  }
}


export default App;
