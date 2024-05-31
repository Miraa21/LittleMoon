import React from 'react';
import { Pagination } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import '../index.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

function Paginate({ page, pages, maxPageDisplay = 5, isAdmin = false }) {
  let keyword = useQuery().get("keyword");

  let url = !isAdmin ? '/' : '/admin/productlist/';
  url += keyword ? `?keyword=${keyword}&` : '?';

  return (pages > 1 && (
    <Pagination className='paginate'>
      {/* First */}
      {page > 1 ? (
        <Pagination.First as={Link} to={`${url}page=1`}>First</Pagination.First>
      ) : (
        <Pagination.First disabled>First</Pagination.First>
      )}

      {/* Prev */}
      {page > 1 ? (
        <Pagination.Prev as={Link} to={`${url}page=${page - 1}`}>&laquo;</Pagination.Prev>
      ) : (
        <Pagination.Prev disabled>&laquo;</Pagination.Prev>
      )}

      {/* Pages */}
      {[...Array(pages).keys()].map((x) => (
        <Pagination.Item 
          key={x + 1} 
          active={x + 1 === page} 
          as={Link} 
          to={`${url}page=${x + 1}`}
        >
          {x + 1}
        </Pagination.Item>
      ))}

      {/* Next */}
      {page < pages ? (
        <Pagination.Next as={Link} to={`${url}page=${page + 1}`}>&raquo;</Pagination.Next>
      ) : (
        <Pagination.Next disabled>&raquo;</Pagination.Next>
      )}

      {/* Last */}
      {page < pages ? (
        <Pagination.Last as={Link} to={`${url}page=${pages}`}>Last</Pagination.Last>
      ) : (
        <Pagination.Last disabled>Last</Pagination.Last>
      )}
    </Pagination>
  ));
}

export default Paginate;
