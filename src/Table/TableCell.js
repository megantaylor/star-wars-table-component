import * as React from 'react';

export default function TableCell({
  content,
  header,
  fixed,
  height,
  sort,
  cellIndex,
  sortType,
  active,
  sortAscending
}) {
  const fixedClass = fixed ? ' cell-fixed' : '';
  const headerClass = header ? ' cell-header' : '';
  const style = height ? { height: `${height}px` } : undefined;
  const sortOrder = sortAscending ? 'asc' : 'dsc';
  const activeClass = active ? ' cell-active ' + sortOrder : '';
  const className = `cell${fixedClass}${headerClass}${activeClass}`;

  const handleContent = content => {
    if (typeof content === 'object' && content.hasOwnProperty('sortBy')) {
      return (
        <ul>
          {content.titles.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ul>
      );
    } else if (content instanceof Array && content.length > 1) {
      return (
        <ul>
          {Object.values(content).map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ul>
      );
    } else if (content.indexOf('https://') > -1) {
      return (
        <a target='_blank' rel='noopener noreferrer' href={content}>
          {content}
        </a>
      );
    } else if (isNaN(content) && !isNaN(Date.parse(content))) {
      let date = new Date(content);
      return date.toLocaleDateString();
    } else {
      return content;
    }
  };

  const cellMarkup = header ? (
    <th
      className={className}
      onClick={e => sort(e, cellIndex, sortType)}
      scope='col'
    >
      {content}
    </th>
  ) : fixed ? (
    <th className={className} style={style} scope='row'>
      {content}
    </th>
  ) : (
    <td className={className} style={style}>
      {handleContent(content)}
    </td>
  );

  return cellMarkup;
}
