import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { SelectComponent } from '../../../common/SelectComponent';
import { ButtonComponent } from '../../../common/ButtonComponent';
import './GoalPagination.css';

const PAGE_SIZE_OPTIONS = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 50, label: '50' }
];

export const GoalPagination = ({
    currentPage = 1,
    totalPages = 1,
    pageSize = 10,
    totalItems = 0,
    onPageChange,
    onPageSizeChange
}) => {
    // Helper function to build dynamic page number ranges with ellipses
    const getPageRange = (current, total) => {
        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        const pages = [];
        // First page is always shown
        pages.push(1);

        const start = Math.max(2, current - 2);
        const end = Math.min(total - 1, current + 2);

        if (start > 2) {
            pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < total - 1) {
            pages.push('...');
        }

        // Last page is always shown
        pages.push(total);

        return pages;
    };

    const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const handleFirst = () => {
        if (currentPage > 1 && onPageChange) {
            onPageChange(1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1 && onPageChange) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages && onPageChange) {
            onPageChange(currentPage + 1);
        }
    };

    const handleLast = () => {
        if (currentPage < totalPages && onPageChange) {
            onPageChange(totalPages);
        }
    };

    const handlePageClick = (num) => {
        if (onPageChange) {
            onPageChange(num);
        }
    };

    return (
        <DashboardCard className="goal-pagination-card" hover={false} shadow={true} padding="16px 24px">
            <div className="goal-pagination-container d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
                {/* 1. Showing Records Information (Left) */}
                <div className="goal-pagination-info text-start">
                    <span className="pagination-info-text">
                        Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalItems}</strong> Goals
                    </span>
                </div>

                {/* 2. Rows Per Page Selector (Center) */}
                <div className="goal-pagination-size d-flex align-items-center gap-2">
                    <span className="pagination-size-label">Rows per page</span>
                    <SelectComponent
                        name="pageSizeSelect"
                        className="pagination-size-select"
                        value={pageSize}
                        onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
                        options={PAGE_SIZE_OPTIONS}
                    />
                </div>

                {/* 3. Pagination Controls (Right) */}
                <div className="goal-pagination-controls d-flex align-items-center gap-2">
                    {/* First Page Button */}
                    <ButtonComponent
                        type="button"
                        className={`pagination-nav-btn first-btn ${currentPage === 1 ? 'disabled' : ''}`}
                        onclick={currentPage > 1 ? handleFirst : null}
                        text={<i className="bi bi-chevron-double-left"></i>}
                        label="First Page"
                    />

                    {/* Previous Button */}
                    <ButtonComponent
                        type="button"
                        className={`pagination-nav-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
                        onclick={currentPage > 1 ? handlePrev : null}
                        text={<i className="bi bi-chevron-left"></i>}
                        label="Previous Page"
                    />

                    {/* Page Numbers */}
                    <div className="pagination-pages-list d-flex align-items-center gap-1">
                        {getPageRange(currentPage, totalPages).map((num, idx) => {
                            if (num === '...') {
                                return (
                                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis px-2">
                                        ...
                                    </span>
                                );
                            }
                            return (
                                <ButtonComponent
                                    key={num}
                                    type="button"
                                    className={`pagination-page-btn ${num === currentPage ? 'is-active' : ''}`}
                                    onclick={() => handlePageClick(num)}
                                    text={num}
                                    label={`Page ${num}`}
                                />
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <ButtonComponent
                        type="button"
                        className={`pagination-nav-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                        onclick={currentPage < totalPages ? handleNext : null}
                        text={<i className="bi bi-chevron-right"></i>}
                        label="Next Page"
                    />

                    {/* Last Page Button */}
                    <ButtonComponent
                        type="button"
                        className={`pagination-nav-btn last-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                        onclick={currentPage < totalPages ? handleLast : null}
                        text={<i className="bi bi-chevron-double-right"></i>}
                        label="Last Page"
                    />
                </div>
            </div>
        </DashboardCard>
    );
};

export default GoalPagination;
