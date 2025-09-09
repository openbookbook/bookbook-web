import React from 'react';
import useBallot from '../../state/useBallot';

/** @typedef {import('../../utils/backend-api').Election} Election */

/**
 * @param {{
 *   election: Pick<Election, 'isCompleted'>;
 *   onEndVote: ReturnType<typeof useBallot>['endVote'];
 * }} props
 */
const AdminPanel = props => {
  const { election, onEndVote } = props;

  return (
    <div className="AdminPanel panel">
      <button className="primary" onClick={onEndVote} disabled={Boolean(election?.isCompleted)}>end vote!</button>
    </div>
  );
};

const MemoizedAdminPanel = React.memo(AdminPanel);

export default AdminPanel;
export { MemoizedAdminPanel };
