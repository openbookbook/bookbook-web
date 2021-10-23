
const AdminPanel = props => {
  return (
    <div className="AdminPanel panel">
      hello, admin!
      <button className="primary" onClick={props.onEndVote} disabled={Boolean(props.winners)}>End vote!</button>
    </div>
  );
};

export default AdminPanel;
