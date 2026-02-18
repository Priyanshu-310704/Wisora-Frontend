export default function TopicFilter({ topics, activeTopic, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('')}
        className={`tag-chip ${!activeTopic ? 'active' : ''}`}
      >
        All
      </button>
      {topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelect(topic.name)}
          className={`tag-chip ${activeTopic === topic.name ? 'active' : ''}`}
        >
          {topic.name}
        </button>
      ))}
    </div>
  );
}
