import React from 'react';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.widgetPlaceholder}>
        Тут буде віджет Facebook стрічки
      </div>
      {/* Можна додати інші віджети тут */}
    </aside>
  );
};

export default Sidebar;