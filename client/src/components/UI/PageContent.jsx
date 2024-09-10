import classes from "./PageContent.module.css";

function PageContent({ title, children }) {
  return <div className="content-container">{children}</div>;
}

export default PageContent;
