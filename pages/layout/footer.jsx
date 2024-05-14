import pkg from '@/package.json';

export const Footer = (props) => {

  const version = pkg.version;

  return (
    <div className="layout-footer">
      <span>RuiBai {version} by </span>
      <a href="http://svrone.rosewil.com" target="_blank" rel="noopener noreferrer">
        Rosewil
      </a>
    </div>
  );
}
