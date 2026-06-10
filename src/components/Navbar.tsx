
interface NavbarProps {
  onLogout: () => void;
  setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
}

export default function Navbar({ onLogout, setAlert }: NavbarProps) {
  return (
    <header className="navbar">
      <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); onLogout(); }}>
        ScholarlyPath
      </a>
      <nav>
        <ul className="nav-links">
          <li>
            <a 
              href="#programs" 
              onClick={(e) => { 
                e.preventDefault(); 
                setAlert({ type: 'success', message: 'Navigating to Programs...' }); 
              }}
            >
              Programs
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              onClick={(e) => { 
                e.preventDefault(); 
                setAlert({ type: 'success', message: 'Navigating to About Us...' }); 
              }}
            >
              About Us
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              onClick={(e) => { 
                e.preventDefault(); 
                setAlert({ type: 'success', message: 'Navigating to Contact...' }); 
              }}
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
      <button 
        className="nav-btn" 
        onClick={() => setAlert({ type: 'success', message: 'Opening Support Ticket portal...' })}
      >
        Support
      </button>
    </header>
  );
}
