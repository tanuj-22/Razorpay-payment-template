import React from 'react'
import logo from './logo.svg'
import './App.css'

require('dotenv').config()

function loadScript(src){

  return new Promise(resolve =>{
    const script = document.createElement('script')
    script.src = src
    
    script.onload = ()=>{
      resolve(true)
    }
    script.onerror = ()=>{
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

const __DEV__ = document.domain==='localhost'


function App() {

  //const [name,setName] = useState('Tanuj')
  async function displayRazorpay(){

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    if(!res){
      alert('Razorpay SDK failed to load')
      return
    }
    const data = await fetch('http://localhost:1337/razorpay', { method: 'POST' }).then((t) =>
			t.json()
		)

		console.log(data)

    const options = {

      "key": __DEV__ ? process.env.Razorpay_test_key : 'API_NOT_AVAILABLE(production_key)', // Enter the Key ID generated from the Dashboard
      "amount": data.amount.toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": data.currency,
      "name": "Donation",
      "description": "Thank you for you contribution",
      "image": 'http://localhost:1337/logo.svg',
      "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": function (response){
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature)
      },
      "prefill": {
            //name,
          //"name": "Gaurav Kumar",
           //"email": "gaurav.kumar@example.com",
           //"contact": "9999999999"
      },
      
  };
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
  
  }



  return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					onClick={displayRazorpay}
					target="_blank"
					rel="noopener noreferrer"
				>
					Click To Donate 
				</a>
			</header>
		</div>
	)
}

export default App;
