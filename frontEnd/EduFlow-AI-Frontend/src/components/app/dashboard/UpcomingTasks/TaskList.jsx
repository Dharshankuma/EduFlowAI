import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

export const TaskList = ({ tasks = [], onTaskClick }) => {
    return (
        <div className="task-list-component">
            {/* Loop upcoming task data */}
            {tasks.map((task, index) => (
                <TaskItem
                    key={task.id || index}
                    title={task.title}
                    subject={task.subject}
                    dueDate={task.dueDate}
                    dueTime={task.dueTime}
                    priority={task.priority}
                    status={task.status}
                    icon={task.icon}
                    onStatusToggle={() => onTaskClick && onTaskClick(task)}
                />
            ))}
        </div>
    );
};

export default TaskList;
