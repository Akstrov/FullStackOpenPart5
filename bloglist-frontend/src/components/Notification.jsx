import '../style.css';
const Notification = ({ message, type }) => {
  return (
    <>
      <p className={type}>{message}</p>
    </>
  );
};

export default Notification;
