import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const Nav = () => {
  const beaniesRef = useRef<HTMLAnchorElement>(null);
  const facemasksRef = useRef<HTMLAnchorElement>(null);
  const glovesRef = useRef<HTMLAnchorElement>(null);

  const handleLinkClick = (e) => {
    if (beaniesRef.current === e.target) {
        glovesRef.current!.classList.remove('active');
        facemasksRef.current!.classList.remove('active');
      } else if (facemasksRef.current === e.target) {
        beaniesRef.current!.classList.remove('active');
        glovesRef.current!.classList.remove('active');
      } else if (glovesRef.current === e.target) {
        beaniesRef.current!.classList.remove('active');
        facemasksRef.current!.classList.remove('active');
      };
      e.target.classList.add("active");
  }

  const history = useHistory();
  const slug: string = history?.location.pathname.match(/\w+/)![0];

  useEffect(() => {
    if (slug === 'beanies') {
      if (beaniesRef.current !== null) {
        beaniesRef.current!.classList.add('active');
      };
    } else if (slug === 'facemasks') {
      if (facemasksRef.current !== null) {
        facemasksRef.current!.classList.add('active');
      };
    } else if (slug === 'gloves') {
      if (glovesRef.current !== null) {
        glovesRef.current!.classList.add('active');
      };
    };
  }, [slug])

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <ul className="navbar-nav">
        <li className="nav-item beanies-nav">
          <Link className="nav-link beanies-link" to="/beanies?page=1" ref={beaniesRef} onClick={handleLinkClick} >Beanies</Link>
        </li>
        <li className="nav-item facemasks-nav">
          <Link className="nav-link facemasks-link" to="/facemasks?page=1" ref={facemasksRef} onClick={handleLinkClick} >Facemasks</Link>
        </li>
        <li className="nav-item gloves-nav">
          <Link className="nav-link gloves-link" to="/gloves?page=1" ref={glovesRef} onClick={handleLinkClick} >Gloves</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav;
