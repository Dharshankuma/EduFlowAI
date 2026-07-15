import React, { useState, useEffect, useMemo } from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import CardHeader from '../../../common/CardHeader/CardHeader';
import FocusTimer from './FocusTimer';
import TimerControls from './TimerControls';
import './FocusSession.css';

export const FocusSession = ({
    subject = 'Data Structures',
    duration = 1500, // default 25 minutes
    onPlay,
    onPause,
    onPrevious,
    onNext
}) => {
    // 1. Timer countdown states
    const [remainingTime, setRemainingTime] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionCompleted, setSessionCompleted] = useState(false);

    // Sync remainingTime if duration prop changes while timer is idle
    useEffect(() => {
        if (!isRunning) {
            setRemainingTime(duration);
        }
    }, [duration, isRunning]);

    // 2. Interval countdown logic
    useEffect(() => {
        let intervalId = null;

        if (isRunning) {
            intervalId = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 1) {
                        setIsRunning(false);
                        setSessionCompleted(true);
                        clearInterval(intervalId);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning]);

    // 3. Compute elapsed progress (0% -> 100%) for conic gradient ring
    const progress = useMemo(() => {
        if (duration <= 0) return 0;
        return ((duration - remainingTime) / duration) * 100;
    }, [remainingTime, duration]);

    // Control triggers
    const handlePlay = () => {
        setIsRunning(true);
        setSessionCompleted(false);
        if (onPlay) onPlay();
    };

    const handlePause = () => {
        setIsRunning(false);
        if (onPause) onPause();
    };

    const handleReset = () => {
        setIsRunning(false);
        setRemainingTime(duration);
        setSessionCompleted(false);
    };

    return (
        <DashboardCard className="focus-session-card" hover={false} shadow={true} padding="24px">
            <CardHeader
                title="Focus Session"
                rightContent={
                    <i className="bi bi-clock-history text-primary" style={{ fontSize: '1.25rem' }}></i>
                }
            />
            
            <div className="focus-session-body">
                {/* Timer progress ring */}
                <FocusTimer
                    duration={duration}
                    remainingTime={remainingTime}
                    progress={progress}
                    status={isRunning ? 'running' : 'idle'}
                />
                
                {/* Subject descriptor */}
                <div className="focus-subject-details">
                    <span className="focus-subject-label">Subject</span>
                    <h4 className="focus-subject-title">{subject}</h4>
                    {sessionCompleted && (
                        <span className="session-complete-alert text-success mt-2 d-block">
                            <i className="bi bi-patch-check-fill me-1"></i> Session Completed!
                        </span>
                    )}
                </div>
                
                {/* Action buttons controls */}
                <TimerControls
                    isRunning={isRunning}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onReset={handleReset}
                    onPrevious={onPrevious}
                    onNext={onNext}
                />
            </div>
        </DashboardCard>
    );
};

export default FocusSession;
