import React, { useState } from 'react';
import { Ticket, Plus, MessageSquare, Sparkles, Send, X, ChevronDown, User, Clock, AlertCircle } from 'lucide-react';

const DeveloperPage = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: "Login authentication not working",
      description: "Customer unable to login after password reset. Error message: 'Invalid credentials'",
      customer: "John Smith",
      status: "open",
      createdAt: new Date('2026-01-05'),
      comments: []
    },
    {
      id: 2,
      title: "Billing discrepancy on invoice #4532",
      description: "Customer reports being charged twice for December subscription",
      customer: "Sarah Johnson",
      status: "in-progress",
      createdAt: new Date('2026-01-04'),
      comments: [
        { author: "Agent", text: "Investigating the duplicate charge with billing team", timestamp: new Date() }
      ]
    }
  ]);

  const [view, setView] = useState('list');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customer: ''
  });

  const statuses = [
    { value: 'all', label: 'All Tickets', color: 'gray' },
    { value: 'open', label: 'Open', color: 'blue' },
    { value: 'in-progress', label: 'In Progress', color: 'yellow' },
    { value: 'resolved', label: 'Resolved', color: 'green' },
    { value: 'closed', label: 'Closed', color: 'gray' }
  ];

  const createTicket = () => {
    if (!formData.title || !formData.customer) return;

    const newTicket = {
      id: tickets.length + 1,
      ...formData,
      status: 'open',
      createdAt: new Date(),
      comments: []
    };

    setTickets([...tickets, newTicket]);
    setFormData({ title: '', description: '', customer: '' });
    setShowCreateForm(false);
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(tickets.map(t => 
      t.id === ticketId ? { ...t, status: newStatus } : t
    ));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  const addComment = (ticketId, comment) => {
    const newCommentObj = {
      author: "Agent",
      text: comment,
      timestamp: new Date()
    };

    setTickets(tickets.map(t => 
      t.id === ticketId ? { ...t, comments: [...t.comments, newCommentObj] } : t
    ));

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        comments: [...selectedTicket.comments, newCommentObj]
      });
    }

    setNewComment('');
  };

  const generateAIReply = async () => {
    if (!selectedTicket) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a professional customer support agent. Draft a helpful, empathetic response to this support ticket:

Title: ${selectedTicket.title}
Description: ${selectedTicket.description}
Customer: ${selectedTicket.customer}

Previous comments:
${selectedTicket.comments.map(c => `- ${c.text}`).join('\n') || 'None'}

Write a professional support response that:
1. Acknowledges the issue
2. Shows empathy
3. Provides clear next steps or solutions
4. Maintains a helpful tone

Keep the response concise (2-3 paragraphs).`
            }
          ]
        })
      });

      const data = await response.json();
      const aiReply = data.content[0].text;
      setNewComment(aiReply);
    } catch (error) {
      console.error('Error generating AI reply:', error);
      setNewComment('Error generating reply. Please write manually.');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredTickets = filterStatus === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === filterStatus);

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.open;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ticket className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Support Tickets</h1>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex gap-2">
          {statuses.map(status => (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label}
              <span className="ml-2 text-xs">
                ({status.value === 'all' ? tickets.length : tickets.filter(t => t.status === status.value).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-1 space-y-3">
            {filteredTickets.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No tickets found</p>
              </div>
            ) : (
              filteredTickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`bg-white rounded-lg p-4 cursor-pointer border-2 transition-all hover:shadow-md ${
                    selectedTicket?.id === ticket.id
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm pr-2">{ticket.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {ticket.customer}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(ticket.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ticket Detail */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Detail Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedTicket.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {selectedTicket.customer}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(selectedTicket.createdAt)}
                        </div>
                      </div>
                    </div>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <p className="text-gray-700">{selectedTicket.description}</p>
                </div>

                {/* Comments Section */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Activity & Comments
                  </h3>

                  <div className="space-y-4 mb-6">
                    {selectedTicket.comments.length === 0 ? (
                      <p className="text-gray-500 text-sm">No comments yet</p>
                    ) : (
                      selectedTicket.comments.map((comment, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={generateAIReply}
                        disabled={isGenerating}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles className="w-4 h-4" />
                        {isGenerating ? 'Generating...' : 'Draft AI Reply'}
                      </button>
                    </div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment or use AI to draft a reply..."
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => addComment(selectedTicket.id, newComment)}
                        disabled={!newComment.trim()}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a ticket</h3>
                <p className="text-gray-500">Choose a ticket from the list to view details and add comments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description of the issue"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the issue..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={createTicket}
                  disabled={!formData.title || !formData.customer}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Create Ticket
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperPage;