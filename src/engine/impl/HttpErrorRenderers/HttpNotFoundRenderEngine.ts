import {Injectable, ProviderScope} from "@tsed/di";
import {Exception, NotFound} from "@tsed/exceptions";
import {HTTP_RENDER_ENGINE} from "../../../model/di/tokens";
import {ResourceNotFound} from "@tsed/platform-exceptions";
import {AbstractEjsHttpRenderEngine} from "./AbstractEjsHttpRenderEngine";

@Injectable({
    scope: ProviderScope.SINGLETON,
    type: HTTP_RENDER_ENGINE
})
export class HttpNotFoundRenderEngine extends AbstractEjsHttpRenderEngine {

    public override supportsError(exception: Exception): boolean {
        return exception instanceof ResourceNotFound || exception instanceof NotFound;
    }

    public override getTitle(): string {
        return "The page you’re looking for doesn't exist.";
    }

}
