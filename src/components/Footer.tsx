
interface FooterProps {
  setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
}

export default function Footer({ setAlert }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-logo">ScholarlyPath</span>
        <span className="footer-copy">© 2024 ScholarlyPath Academy. All rights reserved.</span>
      </div>
      <div className="footer-links">
        <a 
          href="#privacy" 
          onClick={(e) => { 
            e.preventDefault(); 
            setAlert({ type: 'success', message: 'Opening Privacy Policy...' }); 
          }}
        >
          Privacy Policy
        </a>
        <a 
          href="#terms" 
          onClick={(e) => { 
            e.preventDefault(); 
            setAlert({ type: 'success', message: 'Opening Terms of Service...' }); 
          }}
        >
          Terms of Service
        </a>
        <a 
          href="#support" 
          onClick={(e) => { 
            e.preventDefault(); 
            setAlert({ type: 'success', message: 'Opening Support Documentation...' }); 
          }}
        >
          Support
        </a>
        <a 
          href="#accessibility" 
          onClick={(e) => { 
            e.preventDefault(); 
            setAlert({ type: 'success', message: 'Opening Accessibility Portal...' }); 
          }}
        >
          Accessibility
        </a>
      </div>
    </footer>
  );
}
