import React from 'react';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#343a40', color: 'white', textAlign: 'center', padding: '10px', position: 'fixed', left: '0', bottom: '0', width: '100%' }}>
      <p>Capstone Store &copy; {new Date().getFullYear()}</p>
    </footer>
  );
}

export default Footer;

