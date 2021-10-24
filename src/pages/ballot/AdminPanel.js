
const AdminPanel = props => {
  const { ballot, onEndVote } = props;
  
  return (
    <div className="AdminPanel panel">
      hello, admin!
      <button className="primary" onClick={onEndVote} disabled={Boolean(ballot?.endDate)}>end vote!</button>
    </div>
  );
};

export default AdminPanel;
