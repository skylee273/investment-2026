import { useRef, useCallback, useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { CONNECTION_TYPES } from '../../data/sectors'

const styles = {
  emptyState: (width, height) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height,
    backgroundColor: '#1A1A2E',
  }),
  emptyContent: {
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '36px',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#8B95A1',
  },
}

export default function NetworkGraph({ companies, connections, width, height, onNodeClick }) {
  const graphRef = useRef()

  const graphData = useMemo(() => {
    const nodes = companies.map(company => ({
      id: company.id,
      name: company.name,
      color: company.color || '#3182F6',
      sector: company.sector,
      description: company.description,
      val: 1,
    }))

    const links = connections.map(conn => ({
      source: conn.sourceId,
      target: conn.targetId,
      type: conn.type,
      label: conn.label,
      strength: conn.strength || 3,
      color: CONNECTION_TYPES.find(t => t.id === conn.type)?.color || '#6B7684',
    }))

    return { nodes, links }
  }, [companies, connections])

  const handleNodeClick = useCallback((node) => {
    if (onNodeClick) {
      onNodeClick(node)
    }
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 500)
      graphRef.current.zoom(2, 500)
    }
  }, [onNodeClick])

  const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
    const label = node.name
    const fontSize = 12 / globalScale
    ctx.font = `bold ${fontSize}px Pretendard, sans-serif`
    const textWidth = ctx.measureText(label).width
    const nodeRadius = 16

    // Node circle
    ctx.beginPath()
    ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false)
    ctx.fillStyle = node.color
    ctx.fill()

    // White border
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2 / globalScale
    ctx.stroke()

    // Label background
    const bckgDimensions = [textWidth + 8, fontSize + 4]
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillRect(
      node.x - bckgDimensions[0] / 2,
      node.y + nodeRadius + 4,
      bckgDimensions[0],
      bckgDimensions[1]
    )

    // Label text
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#191F28'
    ctx.fillText(label, node.x, node.y + nodeRadius + 4 + bckgDimensions[1] / 2)
  }, [])

  const linkCanvasObjectMode = useCallback(() => 'after', [])

  const linkCanvasObject = useCallback((link, ctx, globalScale) => {
    const start = link.source
    const end = link.target

    if (typeof start !== 'object' || typeof end !== 'object') return

    // Draw link label at middle
    const textPos = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    }

    const label = link.label || ''
    if (!label) return

    const fontSize = 10 / globalScale
    ctx.font = `${fontSize}px Pretendard, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Label background
    const textWidth = ctx.measureText(label).width
    ctx.fillStyle = 'rgba(30, 30, 30, 0.8)'
    ctx.fillRect(
      textPos.x - textWidth / 2 - 4,
      textPos.y - fontSize / 2 - 2,
      textWidth + 8,
      fontSize + 4
    )

    // Label text
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(label, textPos.x, textPos.y)
  }, [])

  if (companies.length === 0) {
    return (
      <div style={styles.emptyState(width, height)}>
        <div style={styles.emptyContent}>
          <p style={styles.emptyIcon}>🔗</p>
          <p style={styles.emptyText}>
            기업을 추가하면 네트워크 그래프가 표시됩니다
          </p>
        </div>
      </div>
    )
  }

  return (
    <ForceGraph2D
      ref={graphRef}
      width={width}
      height={height}
      graphData={graphData}
      backgroundColor="#1A1A2E"
      nodeRelSize={6}
      nodeCanvasObject={nodeCanvasObject}
      nodePointerAreaPaint={(node, color, ctx) => {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI, false)
        ctx.fill()
      }}
      linkColor={(link) => link.color}
      linkWidth={(link) => link.strength || 2}
      linkDirectionalParticles={2}
      linkDirectionalParticleWidth={3}
      linkDirectionalParticleSpeed={0.005}
      linkCanvasObjectMode={linkCanvasObjectMode}
      linkCanvasObject={linkCanvasObject}
      onNodeClick={handleNodeClick}
      cooldownTicks={100}
      onEngineStop={() => graphRef.current?.zoomToFit(400)}
    />
  )
}
