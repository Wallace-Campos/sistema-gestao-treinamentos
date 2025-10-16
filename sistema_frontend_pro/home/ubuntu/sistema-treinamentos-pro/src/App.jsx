import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './components/Login'
import CalendarioView from './components/CalendarioView'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, Users, BookOpen, Bell, Clock, CheckCircle, Edit, Trash2, CreditCard, Eye, LogOut, BarChart3, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './App.css'

// Configurar axios para usar URL relativa (funciona tanto em dev quanto em produção)
axios.defaults.baseURL = ''

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [clientes, setClientes] = useState([])
  const [treinamentos, setTreinamentos] = useState([])
  const [lembretes, setLembretes] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [clienteEditando, setClienteEditando] = useState(null)
  const [dialogEditarAberto, setDialogEditarAberto] = useState(false)
  
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    email: '',
    empresa: '',
    perfil: '',
    licencas: 1,
    status: 'ativo',
    login: '',
    linkAcesso: '',
    materiaisPersonalizados: '',
    possuiCredito: false,
    somenteShowroom: false
  })

  const [novoTreinamento, setNovoTreinamento] = useState({
    clienteId: '',
    data: '',
    duracao: '',
    tipo: 'onboarding',
    resumo: '',
    conteudoProximo: '',
    status: 'agendado'
  })

  const [novoLembrete, setNovoLembrete] = useState({
    clienteId: '',
    tipo: 'mensal',
    mensagem: '',
    dataProxima: ''
  })

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (token) {
      carregarDados()
    }
  }, [token])

  const carregarDados = async () => {
    try {
      const [clientesRes, treinamentosRes, lembretesRes] = await Promise.all([
        axios.get('/api/clientes'),
        axios.get('/api/treinamentos'),
        axios.get('/api/lembretes')
      ])
      
      setClientes(clientesRes.data)
      setTreinamentos(treinamentosRes.data)
      setLembretes(lembretesRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleLogin = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    setClientes([])
    setTreinamentos([])
    setLembretes([])
    delete axios.defaults.headers.common['Authorization']
  }

  const adicionarCliente = async () => {
    if (!novoCliente.nome || !novoCliente.email) {
      alert('Por favor, preencha nome e email do cliente!')
      return
    }
    
    try {
      const response = await axios.post('/api/clientes', novoCliente)
      setClientes([...clientes, response.data])
      setNovoCliente({
        nome: '',
        email: '',
        empresa: '',
        perfil: '',
        licencas: 1,
        status: 'ativo',
        login: '',
        linkAcesso: '',
        materiaisPersonalizados: '',
        possuiCredito: false,
        somenteShowroom: false
      })
    } catch (error) {
      alert('Erro ao cadastrar cliente: ' + (error.response?.data?.error || error.message))
    }
  }

  const iniciarEdicao = (cliente) => {
    setClienteEditando({...cliente})
    setDialogEditarAberto(true)
  }

  const salvarEdicao = async () => {
    if (!clienteEditando.nome || !clienteEditando.email) {
      alert('Por favor, preencha nome e email do cliente!')
      return
    }
    
    try {
      const response = await axios.put(`/api/clientes/${clienteEditando.id}`, clienteEditando)
      setClientes(clientes.map(c => c.id === clienteEditando.id ? response.data : c))
      setDialogEditarAberto(false)
      setClienteEditando(null)
    } catch (error) {
      alert('Erro ao atualizar cliente: ' + (error.response?.data?.error || error.message))
    }
  }

  const excluirCliente = async (clienteId) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return
    }
    
    try {
      await axios.delete(`/api/clientes/${clienteId}`)
      setClientes(clientes.filter(c => c.id !== clienteId))
      setTreinamentos(treinamentos.filter(t => parseInt(t.clienteId) !== clienteId))
      setLembretes(lembretes.filter(l => parseInt(l.clienteId) !== clienteId))
    } catch (error) {
      alert('Erro ao excluir cliente: ' + (error.response?.data?.error || error.message))
    }
  }

  const adicionarTreinamento = async () => {
    if (!novoTreinamento.clienteId || !novoTreinamento.data) {
      alert('Por favor, selecione um cliente e uma data!')
      return
    }
    
    try {
      const response = await axios.post('/api/treinamentos', novoTreinamento)
      setTreinamentos([...treinamentos, response.data])
      setNovoTreinamento({
        clienteId: '',
        data: '',
        duracao: '',
        tipo: 'onboarding',
        resumo: '',
        conteudoProximo: '',
        status: 'agendado'
      })
    } catch (error) {
      alert('Erro ao registrar treinamento: ' + (error.response?.data?.error || error.message))
    }
  }

  const adicionarLembrete = async () => {
    if (!novoLembrete.clienteId || !novoLembrete.mensagem) {
      alert('Por favor, selecione um cliente e adicione uma mensagem!')
      return
    }
    
    try {
      const response = await axios.post('/api/lembretes', novoLembrete)
      setLembretes([...lembretes, response.data])
      setNovoLembrete({
        clienteId: '',
        tipo: 'mensal',
        mensagem: '',
        dataProxima: ''
      })
    } catch (error) {
      alert('Erro ao criar lembrete: ' + (error.response?.data?.error || error.message))
    }
  }

  const totalTreinamentos = treinamentos.length
  const treinamentosOngoing = treinamentos.filter(t => t.status === 'ongoing').length
  const totalLicencas = clientes.reduce((acc, c) => acc + parseInt(c.licencas || 0), 0)
  const clientesAtivos = clientes.filter(c => c.status === 'ativo').length
  const clientesComCredito = clientes.filter(c => c.possuiCredito).length
  const clientesShowroom = clientes.filter(c => c.somenteShowroom).length

  const treinamentosPorTipo = [
    { name: 'Onboarding', value: treinamentos.filter(t => t.tipo === 'onboarding').length },
    { name: 'Acompanhamento', value: treinamentos.filter(t => t.tipo === 'acompanhamento').length },
    { name: 'Suporte', value: treinamentos.filter(t => t.tipo === 'suporte').length },
    { name: 'Outros', value: treinamentos.filter(t => t.tipo === 'outros').length }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(c => c.id === parseInt(clienteId))
    return cliente ? cliente.nome : 'Cliente não encontrado'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Gestão de Treinamentos</h1>
              <p className="text-sm text-gray-600">Customer Success & Customer Experience</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Total Treinamentos</CardTitle>
                <BookOpen className="h-4 w-4 opacity-75" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalTreinamentos}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Em Andamento</CardTitle>
                <Clock className="h-4 w-4 opacity-75" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{treinamentosOngoing}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Licenças</CardTitle>
                <CheckCircle className="h-4 w-4 opacity-75" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalLicencas}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Clientes Ativos</CardTitle>
                <Users className="h-4 w-4 opacity-75" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{clientesAtivos}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Com Crédito</CardTitle>
                <CreditCard className="h-4 w-4 opacity-75" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{clientesComCredito}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Showroom</CardTitle>
                <Eye className="h-4 w-4 opacity-75" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{clientesShowroom}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Treinamentos por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={treinamentosPorTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {treinamentosPorTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Visão Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Taxa de Conclusão</span>
                  <span className="text-lg font-bold text-blue-600">
                    {totalTreinamentos > 0 ? Math.round((treinamentos.filter(t => t.status === 'concluido').length / totalTreinamentos) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Clientes Ativos</span>
                  <span className="text-lg font-bold text-green-600">{clientesAtivos}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Média Licenças/Cliente</span>
                  <span className="text-lg font-bold text-purple-600">
                    {clientes.length > 0 ? (totalLicencas / clientes.length).toFixed(1) : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calendario" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-white shadow-sm">
            <TabsTrigger value="calendario">
              <Calendar className="h-4 w-4 mr-2" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="clientes">
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="treinamentos">
              <BookOpen className="h-4 w-4 mr-2" />
              Treinamentos
            </TabsTrigger>
            <TabsTrigger value="lembretes">
              <Bell className="h-4 w-4 mr-2" />
              Lembretes
            </TabsTrigger>
            <TabsTrigger value="historico">
              <BarChart3 className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendario">
            <CalendarioView 
              treinamentos={treinamentos}
              clientes={clientes}
            />
          </TabsContent>

          <TabsContent value="clientes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Cadastrar Novo Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome *</Label>
                      <Input
                        value={novoCliente.nome}
                        onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={novoCliente.email}
                        onChange={(e) => setNovoCliente({...novoCliente, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <Input
                    placeholder="Empresa"
                    value={novoCliente.empresa}
                    onChange={(e) => setNovoCliente({...novoCliente, empresa: e.target.value})}
                  />
                  <Textarea
                    placeholder="Perfil do cliente"
                    value={novoCliente.perfil}
                    onChange={(e) => setNovoCliente({...novoCliente, perfil: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Licenças"
                      value={novoCliente.licencas}
                      onChange={(e) => setNovoCliente({...novoCliente, licencas: e.target.value})}
                    />
                    <Select value={novoCliente.status} onValueChange={(value) => setNovoCliente({...novoCliente, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={novoCliente.possuiCredito}
                        onChange={(e) => setNovoCliente({...novoCliente, possuiCredito: e.target.checked})}
                      />
                      <span className="text-sm">Possui Crédito</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={novoCliente.somenteShowroom}
                        onChange={(e) => setNovoCliente({...novoCliente, somenteShowroom: e.target.checked})}
                      />
                      <span className="text-sm">Showroom</span>
                    </label>
                  </div>
                  <Button onClick={adicionarCliente} className="w-full">Cadastrar</Button>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Clientes ({clientes.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {clientes.map((cliente) => (
                      <Card key={cliente.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">{cliente.nome}</p>
                              <p className="text-sm text-gray-600">{cliente.email}</p>
                            </div>
                            <div className="flex gap-2">
                              {cliente.possuiCredito && <Badge className="bg-green-100 text-green-800">Crédito</Badge>}
                              {cliente.somenteShowroom && <Badge className="bg-yellow-100 text-yellow-800">Showroom</Badge>}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" onClick={() => iniciarEdicao(cliente)}>
                              <Edit className="h-3 w-3 mr-1" /> Editar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => excluirCliente(cliente.id)}>
                              <Trash2 className="h-3 w-3 mr-1" /> Excluir
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="treinamentos">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Registrar Treinamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={novoTreinamento.clienteId} onValueChange={(value) => setNovoTreinamento({...novoTreinamento, clienteId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="datetime-local"
                    value={novoTreinamento.data}
                    onChange={(e) => setNovoTreinamento({...novoTreinamento, data: e.target.value})}
                  />
                  <Select value={novoTreinamento.tipo} onValueChange={(value) => setNovoTreinamento({...novoTreinamento, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="acompanhamento">Acompanhamento</SelectItem>
                      <SelectItem value="suporte">Suporte</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Resumo do treinamento"
                    value={novoTreinamento.resumo}
                    onChange={(e) => setNovoTreinamento({...novoTreinamento, resumo: e.target.value})}
                  />
                  <Textarea
                    placeholder="Conteúdo do próximo (tl;dv)"
                    value={novoTreinamento.conteudoProximo}
                    onChange={(e) => setNovoTreinamento({...novoTreinamento, conteudoProximo: e.target.value})}
                  />
                  <Button onClick={adicionarTreinamento} className="w-full">Registrar</Button>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Treinamentos ({treinamentos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {treinamentos.map((t) => (
                      <Card key={t.id} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <p className="font-semibold">{getClienteNome(t.clienteId)}</p>
                          <p className="text-sm text-gray-600">{new Date(t.data).toLocaleString('pt-BR')}</p>
                          <Badge className="mt-2">{t.tipo}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lembretes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Criar Lembrete</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={novoLembrete.clienteId} onValueChange={(value) => setNovoLembrete({...novoLembrete, clienteId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Mensagem do lembrete"
                    value={novoLembrete.mensagem}
                    onChange={(e) => setNovoLembrete({...novoLembrete, mensagem: e.target.value})}
                  />
                  <Button onClick={adicionarLembrete} className="w-full">Criar Lembrete</Button>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Lembretes ({lembretes.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {lembretes.map((l) => (
                      <Card key={l.id} className="border-l-4 border-l-yellow-500">
                        <CardContent className="pt-4">
                          <p className="font-semibold">{getClienteNome(l.clienteId)}</p>
                          <p className="text-sm">{l.mensagem}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="historico">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle>Histórico de Treinamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {clientes.map((cliente) => {
                  const treinamentosCliente = treinamentos.filter(t => parseInt(t.clienteId) === cliente.id)
                  if (treinamentosCliente.length === 0) return null
                  
                  return (
                    <div key={cliente.id} className="mb-6">
                      <h3 className="font-bold text-lg mb-2">{cliente.nome}</h3>
                      <div className="space-y-2">
                        {treinamentosCliente.map((t) => (
                          <div key={t.id} className="p-3 bg-gray-50 rounded">
                            <p className="font-medium">{t.tipo}</p>
                            <p className="text-sm text-gray-600">{new Date(t.data).toLocaleString('pt-BR')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={dialogEditarAberto} onOpenChange={setDialogEditarAberto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
            </DialogHeader>
            {clienteEditando && (
              <div className="space-y-4">
                <Input
                  placeholder="Nome"
                  value={clienteEditando.nome}
                  onChange={(e) => setClienteEditando({...clienteEditando, nome: e.target.value})}
                />
                <Input
                  placeholder="Email"
                  value={clienteEditando.email}
                  onChange={(e) => setClienteEditando({...clienteEditando, email: e.target.value})}
                />
                <Button onClick={salvarEdicao} className="w-full">Salvar</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default App

