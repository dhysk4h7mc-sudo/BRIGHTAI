/**
 * BrightAI Kernel - API Client
 * Handles all communication with the backend API
 */

(function (global) {
  'use strict';

  class KernelAPI {
    constructor() {
      this.baseURL = '/api/kernel';
      this.timeout = 30000;
      this.retryAttempts = 3;
      this.retryDelays = [500, 1000, 2000]; // Exponential backoff
    }

    /**
     * Make an API request with retry logic
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} Response data
     */
    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const method = options.method || 'GET';
      
      const headers = {
        'Content-Type': 'application/json',
        'x-kernel-user-id': KernelUtils?.getUserId() || 'anonymous',
        'x-kernel-user-name': KernelUtils?.getUserName() || 'مستخدم',
        ...(options.headers || {}),
      };

      let lastError;
      
      for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);

          const response = await fetch(url, {
            method,
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new APIError(
              errorData.error || `HTTP ${response.status}`,
              response.status,
              errorData
            );
          }

          return await response.json();
        } catch (error) {
          lastError = error;
          
          // Don't retry on client errors (4xx)
          if (error instanceof APIError && error.status >= 400 && error.status < 500) {
            throw error;
          }

          // Wait before retrying (exponential backoff)
          if (attempt < this.retryAttempts - 1) {
            await this.sleep(this.retryDelays[attempt]);
          }
        }
      }

      throw lastError;
    }

    /**
     * Sleep for a duration
     * @param {number} ms - Milliseconds
     * @returns {Promise<void>}
     */
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Health & Status Endpoints
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Check system health
     * @returns {Promise<Object>} Health status
     */
    async health() {
      return this.request('/health');
    }

    /**
     * Get provider status
     * @returns {Promise<Object>} Provider info
     */
    async getProviderStatus() {
      try {
        const health = await this.health();
        return {
          status: health.status,
          provider: health.provider?.name || 'demo',
          model: health.provider?.model || 'Demo Mode',
          configured: health.provider?.configured || false,
        };
      } catch (error) {
        return {
          status: 'error',
          provider: 'demo',
          model: 'Demo Mode',
          configured: false,
        };
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Chat Endpoints
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Send a chat message
     * @param {string} query - User query
     * @param {string} context - Optional context
     * @param {string} compliancePackage - Compliance package
     * @returns {Promise<Object>} Chat response
     */
    async chat(query, context = '', compliancePackage = 'general') {
      return this.request('/chat', {
        method: 'POST',
        body: {
          message: query,
          compliancePack: compliancePackage,
          metadata: { context },
        },
      }).then((data) => this.normalizeKernelRecord(data));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Statistics Endpoints
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Get system statistics
     * @returns {Promise<Object>} Statistics data
     */
    async getStats() {
      return this.request('/stats');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Audit Endpoints
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Get audit log entries
     * @param {Object} params - Filter parameters
     * @returns {Promise<Object>} Audit entries
     */
    async getAuditLog(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/audit${queryString ? '?' + queryString : ''}`).then((data) => {
        if (Array.isArray(data.rows)) data.rows = data.rows.map((row) => this.normalizeKernelRecord(row));
        if (Array.isArray(data.entries)) data.entries = data.entries.map((row) => this.normalizeKernelRecord(row));
        return data;
      });
    }

    /**
     * Get audit chain status
     * @returns {Promise<Object>} Chain verification data
     */
    async getChain() {
      return this.request('/chain').then((data) => {
        if (Array.isArray(data.entries)) data.entries = data.entries.map((row) => this.normalizeKernelRecord(row));
        return data;
      });
    }

    /**
     * Backward-compatible alias used by older audit.html builds.
     * @returns {Promise<Object>} Chain verification data
     */
    async getAuditChain() {
      return this.getChain();
    }

    /**
     * Verify chain integrity
     * @returns {Promise<Object>} Verification result
     */
    async verifyChain() {
      return this.request('/chain/verify', { method: 'POST' });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Approvals Endpoints
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Get pending approvals
     * @returns {Promise<Object>} Pending approvals list
     */
    async getPendingApprovals() {
      return this.request('/approvals').then((data) => {
        if (Array.isArray(data.pending)) data.pending = data.pending.map((row) => this.normalizeKernelRecord(row));
        if (Array.isArray(data.recent)) data.recent = data.recent.map((row) => this.normalizeKernelRecord(row));
        return data;
      });
    }

    /**
     * Get pending count only
     * @returns {Promise<number>} Pending count
     */
    async getPendingCount() {
      try {
        const data = await this.getPendingApprovals();
        return data.summary?.totalPending || 0;
      } catch (error) {
        return 0;
      }
    }

    /**
     * Approve a request
     * @param {string} requestId - Request ID
     * @param {string} approver - Approver name
     * @returns {Promise<Object>} Approval result
     */
    async approveRequest(requestId, approver) {
      return this.request('/approvals', {
        method: 'POST',
        body: {
          requestId,
          interactionId: requestId,
          traceId: this.extractTraceId({ traceId: requestId }) || undefined,
          action: 'approve',
          approver,
        },
      }).then((data) => this.normalizeKernelRecord(data));
    }

    /**
     * Reject a request
     * @param {string} requestId - Request ID
     * @param {string} approver - Approver name
     * @param {string} reason - Rejection reason
     * @returns {Promise<Object>} Rejection result
     */
    async rejectRequest(requestId, approver, reason = '') {
      return this.request('/approvals', {
        method: 'POST',
        body: {
          requestId,
          interactionId: requestId,
          traceId: this.extractTraceId({ traceId: requestId }) || undefined,
          action: 'reject',
          approver,
          reason,
        },
      }).then((data) => this.normalizeKernelRecord(data));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Evidence Endpoints
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Get evidence records
     * @param {Object} params - Filter parameters
     * @returns {Promise<Object>} Evidence records
     */
    async getEvidence(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/evidence${queryString ? '?' + queryString : ''}`).then((data) => {
        if (Array.isArray(data.evidence)) data.evidence = data.evidence.map((row) => this.normalizeKernelRecord(row));
        if (Array.isArray(data.rows)) data.rows = data.rows.map((row) => this.normalizeKernelRecord(row));
        return data;
      });
    }

    /**
     * Get single evidence record
     * @param {string} requestId - Request ID
     * @returns {Promise<Object>} Evidence record
     */
    async getEvidenceById(requestId) {
      return this.request(`/evidence/${encodeURIComponent(requestId)}`).then((data) => this.normalizeKernelRecord(data));
    }

    /**
     * Export evidence as JSON
     * @param {string} requestId - Request ID
     * @returns {Promise<Object>} Evidence data
     */
    async exportEvidence(requestId) {
      return this.request(`/evidence/${encodeURIComponent(requestId)}/export`).then((data) => this.normalizeKernelRecord(data));
    }

    /**
     * Extract a canonical AI-YYYY-00000 trace id from modern or legacy payloads.
     * Legacy requestId remains an alias for interactionId only.
     * @param {Object} record - API record
     * @returns {string|null} Trace id
     */
    extractTraceId(record = {}) {
      const value = record.traceId || record.trace_id || record.kernel?.traceId || record.metadata?.traceId || record.summary?.traceId;
      return /^AI-\d{4}-\d{5,}$/.test(String(value || '')) ? String(value) : null;
    }

    /**
     * Normalize Frontend/Backend field names without breaking old rows.
     * @param {Object} record - API record
     * @returns {Object} Normalized record
     */
    normalizeKernelRecord(record = {}) {
      if (!record || typeof record !== 'object') return record;
      const interactionId = record.interactionId || record.interaction_id || record.id || record.requestId || record.request_id || null;
      const traceId = this.extractTraceId(record);
      return {
        ...record,
        interactionId,
        traceId,
        trace_id: traceId,
        requestId: interactionId,
      };
    }

    /**
     * Build a clickable trace link for kernel pages.
     * @param {string} traceId - Canonical trace id
     * @param {string} page - Target kernel page
     * @returns {string} URL
     */
    traceLink(traceId, page = 'evidence') {
      const safeTrace = encodeURIComponent(traceId || '');
      const target = page.endsWith('.html') ? page : `${page}.html`;
      return `/kernel/${target}?trace_id=${safeTrace}`;
    }
  }

  /**
   * Custom API Error class
   */
  class APIError extends Error {
    constructor(message, status, data = {}) {
      super(message);
      this.name = 'APIError';
      this.status = status;
      this.data = data;
    }
  }

  // Create global instance
  const kernelAPI = new KernelAPI();

  // Export to global scope
  global.KernelAPI = KernelAPI;
  global.kernelAPI = kernelAPI;
  global.APIError = APIError;

})(typeof window !== 'undefined' ? window : this);
