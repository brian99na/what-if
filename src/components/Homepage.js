import React, { useRef, useState, useEffect } from "react";
import Prices from "./Prices";
import SecondInvestment from "./SecondInvestment";
import Landing from "./Landing";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

function Homepage(props) {
  const [homepageVisible, setHomepageVisible] = useState(false)
  const priceRef = useRef();
  const inflationRef = useRef();

  useEffect(()=>{
    homepageVisible && priceRef.current.scrollIntoView({
      behavior: "smooth",

    });
  },[homepageVisible])

  const handleInflationClick = () => {
    inflationRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  return (
    <div className='homepage'>
      <section className='home1'>
        <Landing priceRef={priceRef} mainData={props.mainData} setMainData={props.setMainData} setHomepageVisible={setHomepageVisible}/>
      </section>
      {homepageVisible && <section ref={priceRef} className='home2'>
        <Prices results={props.results} mainData={props.mainData} inflationRef={props.inflationRef} handleInflationClick={handleInflationClick}/>
      </section>}
      {homepageVisible && <section ref={inflationRef} className='home3'>
        <SecondInvestment inflation={props.inflation} mainData={props.mainData}/>
      </section>}
    </div>
  );
}

export default Homepage;
