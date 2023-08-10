import React,{useState} from 'react'
import './AddNewItem.css'
import { useNavigate } from 'react-router-dom'
import apiClient from "../../services/apiClient"


function AddNewItem({appState, updateMenu, setAddNewItem}) { 
    const [formInput, setFormInput] = useState({name:'', cost:''})
    const navigate = useNavigate()

    function handleChange(e) {
        const name= e.target.name
        const value= e.target.value

        setFormInput({...formInput, [name]:value})
        console.log(formInput)
    }
    

    async function handleSubmit(e) {
        e.preventDefault()
        const newMenuItem   = await apiClient.addNewItem(formInput)

        console.log('newMenuItem', newMenuItem.data.newMenuItem.image_url)
        formInput.image_url = newMenuItem.data.newMenuItem.image_url
        console.log("formInput Image", formInput.image_url)
        updateMenu({...appState, menuItems:[...appState.menuItems, formInput]})
        setFormInput({name:'', cost:''})
        setAddNewItem(false)
        navigate('/')
    }

    const handleFileChange = (e) => {
        setFormInput({...formInput, [e.target.name]: e.target.files[0]})
        console.log(formInput)
    }

    const buttonStyling= {
        width: '29rem', 
        backgroundColor: 'orange', 
        fontWeight: 'bold',
    borderWidth: '2px',
    cursor: 'pointer',
    height:' 2rem',
    fontFamily: 'didot,serif',
    fontSize: '14pt',
    borderRadius: '10px',
    marginTop: '1%'
    // padding: '0 2rem'sss


    }

    return (
        <div className='new'>
            <h1> New Menu Item</h1>
            <form>
                <label> Name </label>
                <input className= 'new-input' value={formInput.name} onChange={(e) => handleChange(e)} name='name' placeholder='name' required/>
                <label> Image </label>
                <input className='file-selector' name="image" type="file" accept='image/png, image/jpg, image/jpeg' onChange={handleFileChange}/>
                <label> Cost </label>
                <input  className= 'new-input' value={formInput.cost} type='number' onChange={(e) => handleChange(e)} min='0' name='cost' placeholder='cost' required/>
                
                {/* <input className='add-new' name='submit-form' type='button' value='Submit'/> */}
            </form>
            <button style={buttonStyling} className='add-new' onClick={(e) => handleSubmit(e)} > Submit </button>

        </div>
    )
}

export default AddNewItem
