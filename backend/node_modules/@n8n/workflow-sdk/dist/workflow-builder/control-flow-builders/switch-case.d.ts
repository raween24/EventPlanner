import type { NodeInstance, NodeChain } from '../../types/base';
export type SwitchCaseTarget = null | NodeInstance<string, string, unknown> | NodeChain<NodeInstance<string, string, unknown>, NodeInstance<string, string, unknown>> | Array<NodeInstance<string, string, unknown> | NodeChain<NodeInstance<string, string, unknown>, NodeInstance<string, string, unknown>>>;
