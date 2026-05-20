import { useState, useRef, useEffect, useCallback } from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemKey: (item: T, index: number) => string | number;
}

export default function VirtualScroll<T>({ 
  items, 
  itemHeight, 
  containerHeight = 600,
  renderItem,
  itemKey 
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const visibleStartIndex = Math.floor(scrollTop / itemHeight);
  const visibleEndIndex = Math.min(
    visibleStartIndex + Math.ceil(containerHeight / itemHeight) + 2,
    items.length
  );
  
  const visibleItems = items.slice(visibleStartIndex, visibleEndIndex);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  const totalHeight = items.length * itemHeight;
  const offsetTop = visibleStartIndex * itemHeight;

  useEffect(() => {
    setScrollTop(0);
  }, [items.length]);

  return (
    <div
      ref={containerRef}
      className="virtual-scroll-container"
      style={{ height: `${containerHeight}px` }}
      onScroll={handleScroll}
    >
      <div 
        className="virtual-scroll-spacer" 
        style={{ height: `${totalHeight}px` }}
      />
      <div 
        className="virtual-scroll-content"
        style={{ 
          transform: `translateY(${offsetTop}px)`,
          position: 'absolute' as const,
          top: 0,
          left: 0,
          right: 0
        }}
      >
        {visibleItems.map((item, index) => (
          <div 
            key={itemKey(item, index)}
            style={{ height: `${itemHeight}px` }}
          >
            {renderItem(item, index + visibleStartIndex)}
          </div>
        ))}
      </div>
    </div>
  );
}
