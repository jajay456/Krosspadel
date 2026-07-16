export default function Notif({ msg }) {
  return <div className={`notif${msg ? " show" : ""}`}>{msg}</div>;
}