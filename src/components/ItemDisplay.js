import React from 'react';

const ItemDisplay = () => {
  return (
    <div className="ItemDisplay">

    </div>
  );
};

const MemoizedItemDisplay = React.memo(ItemDisplay);

export default ItemDisplay;
export { MemoizedItemDisplay };
