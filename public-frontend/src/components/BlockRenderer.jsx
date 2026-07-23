import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const BlockRenderer = ({ blocks = [] }) => {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="container">
      {sortedBlocks.map((block) => {
        switch (block.type) {
          case 'header':
            return <h2 key={block._id} className="block-header">{block.data.text}</h2>;

          case 'paragraph':
            return <p key={block._id} className="block-paragraph">{block.data.text}</p>;

          case 'list':
            return (
              <ul key={block._id} className="block-list">
                {block.data.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            );

          case 'equation': {
            const { equation, displayMode } = block.data;
            return (
              <div key={block._id} className="block-equation">
                {displayMode ? (
                  <BlockMath math={equation} />
                ) : (
                  <span>[Formula]: <InlineMath math={equation} /></span>
                )}
              </div>
            );
          }

          case 'table': {
            const { headers, rows } = block.data;
            return (
              <div key={block._id} className="block-table-container">
                <table className="block-table">
                  <thead>
                    <tr>
                      {headers.map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          default:
            return (
              <div key={block._id} style={{ color: 'red' }}>
                Unknown content block format: {block.type}
              </div>
            );
        }
      })}
    </div>
  );
};

export default BlockRenderer;