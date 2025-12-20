"use strict";

const { Contract } = require("fabric-contract-api");

class ProcureAuditContract extends Contract {
  constructor() {
    super("ProcureAuditContract");
  }

  // Deterministic timestamp: comes from the transaction, same on all endorsers
  _getTxISOTime(ctx) {
    const ts = ctx.stub.getTxTimestamp(); // protobuf Timestamp { seconds, nanos }

    const sec =
      ts && ts.seconds
        ? typeof ts.seconds.toNumber === "function"
          ? ts.seconds.toNumber()
          : Number(ts.seconds)
        : 0;

    const nanos = ts && typeof ts.nanos !== "undefined" ? Number(ts.nanos) : 0;

    const ms = sec * 1000 + Math.floor(nanos / 1e6);
    return new Date(ms).toISOString();
  }

  _safeParseJson(str) {
    try {
      return JSON.parse(str);
    } catch (_) {
      return null;
    }
  }

  async InitLedger(ctx) {
    // optional: seed sample data deterministically if you want
    return "OK";
  }

  async AuditRecordExists(ctx, auditId) {
    const key = String(auditId);
    const bytes = await ctx.stub.getState(key);
    return bytes && bytes.length > 0;
  }

  async CreateAuditRecord(ctx, auditId, recordData) {
    const key = String(auditId);

    const exists = await this.AuditRecordExists(ctx, key);
    if (exists) {
      throw new Error(`The audit record ${key} already exists`);
    }

    // Keep Data as object if JSON, otherwise as string
    const parsed = this._safeParseJson(String(recordData));
    const dataField = parsed !== null ? parsed : String(recordData);

    const auditRecord = {
      ID: key,
      Data: dataField,
      Timestamp: this._getTxISOTime(ctx),
    };

    await ctx.stub.putState(key, Buffer.from(JSON.stringify(auditRecord)));

    // Emit event for automatic analysis
    const eventPayload = {
      auditId: key,
      type: auditRecord.Data?.type || "unknown",
      timestamp: auditRecord.Timestamp,
    };
    ctx.stub.setEvent(
      "AUDIT_CREATED",
      Buffer.from(JSON.stringify(eventPayload))
    );

    return JSON.stringify(auditRecord);
  }

  async ReadAuditRecord(ctx, auditId) {
    const key = String(auditId);
    const bytes = await ctx.stub.getState(key);
    if (!bytes || bytes.length === 0) {
      throw new Error(`The audit record ${key} does not exist`);
    }
    return bytes.toString("utf8");
  }

  async GetAllAuditRecords(ctx) {
    const allResults = [];

    const iterator = await ctx.stub.getStateByRange("", "");
    try {
      while (true) {
        const res = await iterator.next();
        if (res.done) break;

        const raw = res.value.value.toString("utf8");
        const parsed = this._safeParseJson(raw);
        allResults.push(parsed !== null ? parsed : raw);
      }
    } finally {
      await iterator.close();
    }

    return JSON.stringify(allResults);
  }

  async ClearAllAuditRecords(ctx) {
    const deletedKeys = [];
    const iterator = await ctx.stub.getStateByRange("", "");

    try {
      while (true) {
        const res = await iterator.next();
        if (res.done) break;

        const key = res.value.key;
        await ctx.stub.deleteState(key);
        deletedKeys.push(key);
      }
    } finally {
      await iterator.close();
    }

    return JSON.stringify({
      message: "All audit records cleared",
      deletedCount: deletedKeys.length,
      deletedKeys,
    });
  }

  async StoreAnalysis(ctx, auditId, analysisPayload) {
    const key = `analysis::${String(auditId)}`;

    // Check if analysis already exists - if so, return existing (idempotent)
    const exists = await this.AuditRecordExists(ctx, key);
    if (exists) {
      // Return existing analysis instead of throwing error
      const bytes = await ctx.stub.getState(key);
      return bytes.toString("utf8");
    }

    const parsed = this._safeParseJson(String(analysisPayload));
    const dataField = parsed !== null ? parsed : String(analysisPayload);

    const analysisRecord = {
      ID: key,
      AuditID: auditId,
      Data: dataField,
      Timestamp: this._getTxISOTime(ctx),
    };

    await ctx.stub.putState(key, Buffer.from(JSON.stringify(analysisRecord)));
    return JSON.stringify(analysisRecord);
  }
}

module.exports = ProcureAuditContract;
