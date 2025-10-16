import { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
// Locale pt-br será configurado inline

export default function CalendarioView({ treinamentos, clientes, onEventClick, onDateClick }) {
  const calendarRef = useRef(null)

  const events = treinamentos.map(t => {
    const cliente = clientes.find(c => c.id === parseInt(t.clienteId))
    const tipoColors = {
      'onboarding': '#3b82f6',
      'acompanhamento': '#10b981',
      'suporte': '#f59e0b',
      'outros': '#8b5cf6'
    }

    return {
      id: t.id,
      title: cliente ? `${cliente.nome} - ${t.tipo}` : t.tipo,
      start: t.data,
      end: t.data,
      backgroundColor: tipoColors[t.tipo] || '#6b7280',
      borderColor: tipoColors[t.tipo] || '#6b7280',
      extendedProps: {
        treinamento: t,
        cliente: cliente
      }
    }
  })

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="pt-br"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia'
        }}
        events={events}
        eventClick={(info) => {
          if (onEventClick) {
            onEventClick(info.event.extendedProps.treinamento)
          }
        }}
        dateClick={(info) => {
          if (onDateClick) {
            onDateClick(info.dateStr)
          }
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        height="auto"
        eventDisplay="block"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
    </div>
  )
}

