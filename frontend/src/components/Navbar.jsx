import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../helper/axios';

export default function Navbar() {
    //just test useContext
    let {user,dispatch} = useContext(AuthContext);
    let navigate = useNavigate()
    
    let logout = async() =>{
        let res = await axios.post('/api/users/logout')
        if(res.status == 200){
            dispatch({type : "LOGOUT"})
            navigate('/recipes/signin')
        }
    }
    return (
        <nav className='flex justify-between items-center p-5 bg-white'>
            <div>
                <h1 className='font-bold text-2xl text-orange-400'>Recipicity</h1>
            </div>
            <ul className=' flex space-x-10'>
                {!!user && <li><Link to="/" className='hover:text-orange-400'>{user.name}</Link></li>}
                <li><Link to="/about" className='hover:text-orange-400'>About</Link></li>
                <li><Link to="/contact" className='hover:text-orange-400'>Contact</Link></li>
                <li><Link to="/recipes/create" className='hover:text-orange-400'>Create Recipe</Link></li>
                {!user && (<li><Link to="/recipes/signup" className='hover:text-orange-400'>SignUp</Link></li>)}
                {!!user && (<li><button onClick={logout} className='hover:text-orange-400'>logout</button></li>)}
            </ul>
        </nav>
    )
}
