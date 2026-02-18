export default function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  description = 'Be the first to contribute!',
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="text-6xl mb-4 animate-float">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-700 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-xs text-center mb-6">
        {description}
      </p>
      {action && (
        <button onClick={action} className="btn-primary">
          {actionLabel || 'Get Started'}
        </button>
      )}
    </div>
  );
}
