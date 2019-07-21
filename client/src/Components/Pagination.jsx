import React from "react";
import "../Styles/Home.scss";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];
  for (let t = 1; t <= Math.ceil(totalPosts / postsPerPage); t++) {
    pageNumbers.push(t);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => {
          return (
            <li key={number} className="page-item">
              <a
                id="pagination"
                onClick={() => paginate(number)}
                className="page-link"
              >
                {number}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Pagination;
