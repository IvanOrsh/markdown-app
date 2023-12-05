export default function Layout(props: {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div>
      {props.sidebar}
      {props.content}
    </div>
  );
}
