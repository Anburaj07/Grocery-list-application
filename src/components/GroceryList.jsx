import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import React, { Component } from "react";
import styled from "styled-components";

export default class GroceryList extends Component {
  state = {
    groceries: [],
    name: "",
    qty: "",
    price: "",
    description: "",
    image: "",
    editingGroceryId: null,
    currentPage: 1,
    totalPages: 1,
  };

  componentDidMount() {
    this.fetchGroceries();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState.currentPage, this.state.currentPage);
    if (prevState.currentPage != this.state.currentPage) {
      this.fetchGroceries();
    }
  }

  fetchGroceries = () => {
    const { currentPage } = this.state;
    console.log("currentPage:", currentPage);
    axios
      .get(`http://localhost:8080/groceries?_page=${currentPage}&_limit=4`)
      .then((res) => {
        this.setState({
          groceries: res.data,
          totalPages: Math.ceil(res.headers["x-total-count"] / 4),
        });
      })
      .catch((err) => {
        console.log("Error fetching groceries:", err);
      });
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handelAddGrocery = () => {
    const { name, qty, price, description, image } = this.state;
    axios
      .post("http://localhost:8080/groceries", {
        name,
        qty,
        price,
        description,
        image,
      })
      .then(() => {
        this.fetchGroceries();
        this.setState({
          name: "",
          qty: "",
          price: "",
          description: "",
          image: "",
        });
      })
      .catch((error) => {
        console.error("Error adding grocery:", error);
      });
  };

  handleEditGrocery = (id) => {
    const grocery = this.state.groceries.find((item) => item.id === id);
    this.setState({
      editingGroceryId: id,
      name: grocery.name,
      qty: grocery.qty,
      price: grocery.price,
      description: grocery.description,
      image: grocery.image,
    });
  };

  handleUpdateGrocery = () => {
    const { editingGroceryId, name, qty, price, description, image } =
      this.state;
    axios
      .put(`http://localhost:8080/groceries/${editingGroceryId}`, {
        name,
        qty,
        price,
        description,
        image,
      })
      .then(() => {
        this.fetchGroceries();
        this.setState({
          editingGroceryId: null,
          name: "",
          qty: "",
          price: "",
          description: "",
          image: "",
        });
      })
      .catch((error) => {
        console.error("Error updating grocery:", error);
      });
  };

  handleDeleteGrocery = (id) => {
    axios
      .delete(`http://localhost:8080/groceries/${id}`)
      .then(() => {
        this.fetchGroceries();
      })
      .catch((error) => {
        console.error("Error deleting grocery:", error);
      });
  };

  render() {
    const {
      groceries,
      name,
      qty,
      price,
      description,
      image,
      editingGroceryId,
      currentPage,
      totalPages,
    } = this.state;
    return (
      <DIV>
        <div id="left">
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={name}
              onChange={this.handleInputChange}
              placeholder="Enter name"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Image</FormLabel>
            <Input
              type="text"
              name="image"
              value={image}
              onChange={this.handleInputChange}
              placeholder="Enter Image URL"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Quantity</FormLabel>
            <Input
              type="text"
              name="qty"
              value={qty}
              onChange={this.handleInputChange}
              placeholder="Enter Quantity"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Price</FormLabel>
            <Input
              type="text"
              name="price"
              value={price}
              onChange={this.handleInputChange}
              placeholder="Enter Price"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              name="description"
              value={description}
              onChange={this.handleInputChange}
              placeholder="Enter Description"
            />
          </FormControl>
          <FormControl>
            {editingGroceryId ? (
              <Button onClick={this.handleUpdateGrocery}>Update Grocery</Button>
            ) : (
              <Button onClick={this.handelAddGrocery}>Add Grocery</Button>
            )}
          </FormControl>
        </div>

        <ul id="right">
          <Heading>Grocery List</Heading>
          <GRID>
          {groceries.map((el) => (
            <li key={el.id}>
              <img src={el.image} alt="" /> {el.name} - Qty: {el.qty} - Price: $
              {el.price}
              <Button id="edit" onClick={() => this.handleEditGrocery(el.id)}>
                Edit
              </Button>
              <Button
                id="delete"
                onClick={() => this.handleDeleteGrocery(el.id)}
              >
                Delete
              </Button>
            </li>
          ))}
          </GRID>
          <PAGINATION>
            <button
              disabled={currentPage == 1}
              onClick={() => this.setState({ currentPage: currentPage - 1 })}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage == totalPages}
              onClick={() => this.setState({ currentPage: currentPage + 1 })}
            >
              Next
            </button>
          </PAGINATION>
        </ul>
      </DIV>
    );
  }
}

const DIV = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1%;
  padding-top: 50px;
  padding-bottom: 220px;
  color: #0c0f3a;
  ::placeholder {
    color: #0c0f3a;
  }
  label {
    margin-top: 15px;
  }
  #left {
    width: 40%;
    /* border: 1px solid red; */
    padding: 20px;

    button {
      margin-top: 10px;
    }
  }
  #right {
    /* border: 1px solid red; */
    width: 50%;
    li {
      display: flex;
      margin: auto;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
      border-radius: 15px;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      /* background-image: linear-gradient(to top, #feada6 0%, #f5efef 100%); */
      background-image: linear-gradient(to top, #30cfd0 0%, #330867 100%);
      img {
        width: 50%;
      }
      #edit {
        background-color: green;
        padding: 15px;
      }
      #delete {
        background-color: red;
      }
    }
    button {
      background-color: #504c4c;
      padding: 10px;
      color: white;
      border-radius: 10px;
    }
  }
`;

const PAGINATION = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
`;

const GRID=styled.div`
    display: grid;
    grid-template-columns: repeat(2,1fr);
    gap: 20px;
    
`