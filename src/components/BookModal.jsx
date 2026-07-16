import { useContext } from "react";
import { VenueContext } from "../context/VenueContext";

export default function BookModal({ open, onClose, onSubmit }) {
  const { venues } = useContext(VenueContext);
  return (
    <div className={`modal${open ? " open" : ""}`}>
      <div className="modal-bg" onClick={onClose} />
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Book Padel</div>
        <div className="form-group">
          <label>Venue</label>
          <select>{venues.map(v => <option key={v.id}>{v.name} — {v.loc}</option>)}</select>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Date</label><input type="date" /></div>
          <div className="form-group"><label>Time</label><input type="time" /></div>
        </div>
        <div className="form-group"><label>Name</label><input type="text" placeholder="Your name" /></div>
        <div className="form-group"><label>Phone</label><input type="tel" placeholder="+66" /></div>
        <br />
        <button className="btn-primary" style={{ width: "100%", textAlign: "center" }} onClick={onSubmit}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}