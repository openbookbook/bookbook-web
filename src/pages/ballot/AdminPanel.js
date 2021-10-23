
const AdminPanel = () => {
  return (
    <div className="AdminPanel panel">
      hello, admin!
      <button className="primary" onClick={this.props.onEndVote} disabled={Boolean(this.props.winners)}>End vote!</button>
    </div>
  );
};

export default AdminPanel;
