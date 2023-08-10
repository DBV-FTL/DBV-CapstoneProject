import React from 'react'
import './Hero.css'
import {useState, useEffect} from 'react'

export default function Hero() {
    const images = [
      'https://www.ulprospector.com/knowledge/wp-content/uploads/2019/11/ethnic-food-iStock-868408746-600x400.jpg',
      'https://blog.remitly.com/wp-content/uploads/2022/09/different-Nigerian-dishes.jpeg.webp',
      'https://bloximages.newyork1.vip.townnews.com/sandiegomagazine.com/content/tncms/assets/v3/editorial/d/8c/d8c6d926-72fb-11eb-a628-efc4e9abab37/6030319469eb5.image.jpg?resize=1200%2C900'
      // Add more image URLs as needed
    ];
  
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
    useEffect(() => {
      const imageTransitionInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000); // Change image every 5 seconds (5000 milliseconds)
    
      return () => {
        clearInterval(imageTransitionInterval);
      };
    }, [images.length]);
  
    // console.log(user);
  
    return (
      <div className="banner">
        <div>
          <img
            src={images[currentImageIndex]}
            alt="banner"
            className="media"
            width="99%"
            height="800"
          />
          <div className="text">
            <h2>
              Intersinee
              <span className='intersinee-span'>
                Inter<strong className="z">Sínee</strong>
              </span>
              <span className='intersinee-span'>
                Inter<strong className="z">Sínee</strong>
              </span>
              <span className='intersinee-span'>
                <h9 className="z">Your taste of Home.</h9>
                <strong> Yum!🧑‍🍳</strong>
              </span>
            </h2>
          </div>
        </div>
      </div>
    );
  }


// import React from 'react'
// import './Hero.css'


// export default function Hero({ loggedin, user }) {

//     console.log(user)
//     return (
//         <div className="banner">
//             <div>
//                 <img src="https://www.ulprospector.com/knowledge/wp-content/uploads/2019/11/ethnic-food-iStock-868408746-600x400.jpg" alt="banner" className="media" width="99%" height="800" ></img>
//                 <div className='text'>
//                     <h2>
//                         Intersinne
//                         <span>Inter<strong className='z'>Sínee</strong></span>
//                         <span>Inter<strong className='z'>Sínee</strong></span>
//                         <span> <h9 className='z'>Your taste of Home.</h9><strong> Yum!🧑‍🍳</strong></span>
//                     </h2>
//                 </div>
//             </div>
//         </div>
//     )
// }





