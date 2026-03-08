export function FacilityMapLegend() {
  return (
    <div className="absolute bottom-6 left-4 z-[1000] rounded-xl border border-[#d0d9e8] bg-white/95 backdrop-blur-sm p-4 text-xs shadow-lg">
      <p className="font-bold text-foreground mb-2 text-sm">Map Legend</p>
      <div className="space-y-1.5">
        {[
          { col: '#2563eb', label: 'Hospital' },
          { col: '#475569', label: 'Clinic' },
          { col: '#EF4444', label: 'Urgent Staffing Needed' },
        ].map(({ col, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="size-3 rounded-full inline-block shrink-0"
              style={{ background: col }}
            />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
        <hr className="my-2 border-[#eee]" />
        <p className="font-semibold text-muted-foreground mb-1">Clusters</p>
        {[
          { col: '#2563eb', label: '< 20 facilities' },
          { col: '#F59E0B', label: '20–50 facilities' },
          { col: '#EF4444', label: '50+ facilities' },
        ].map(({ col, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="size-3 rounded-full inline-block shrink-0"
              style={{ background: col }}
            />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
