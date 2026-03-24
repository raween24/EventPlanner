import { Logger } from '@n8n/backend-common';
import { EventService } from '../../events/event.service';
import { ChatHubAgentService } from './chat-hub-agent.service';
export declare class ChatHubEventRelay {
    private readonly logger;
    private readonly eventService;
    private readonly chatHubAgentService;
    constructor(logger: Logger, eventService: EventService, chatHubAgentService: ChatHubAgentService);
    private handleUserDeleted;
}
