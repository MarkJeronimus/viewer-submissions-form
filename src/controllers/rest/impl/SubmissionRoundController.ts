import {Controller, Inject} from "@tsed/di";
import {Delete, Get, Post, Returns, Security} from "@tsed/schema";
import {StatusCodes} from "http-status-codes";
import {PlatformResponse, QueryParams, Res} from "@tsed/common";
import {SubmissionRoundModel} from "../../../model/db/SubmissionRound.model";
import {SubmissionRoundService} from "../../../services/SubmissionRoundService";
import {BaseRestController} from "../BaseRestController";
import {SuccessModel} from "../../../model/rest/SuccessModel";
import {BadRequest, NotFound} from "@tsed/exceptions";
import {Authorize} from "@tsed/passport";
import {PathParams} from "@tsed/platform-params";

@Controller("/submissionRound")
export class SubmissionRoundController extends BaseRestController {

    @Inject()
    private submissionRoundService: SubmissionRoundService;


    @Post("/newRound")
    @Authorize("login")
    @Security("login")
    @Returns(StatusCodes.CREATED, SubmissionRoundModel)
    public createRound(@QueryParams("name") name: string): unknown {
        return this.submissionRoundService.newSubmissionRound(name);
    }


    @Post("/pauseRound")
    @Authorize("login")
    @Security("login")
    @Returns(StatusCodes.OK, SuccessModel)
    @Returns(StatusCodes.BAD_REQUEST, BadRequest)
    public async pauseRound(@Res() res: PlatformResponse, @QueryParams("pause") pause: boolean): Promise<unknown> {
        await this.submissionRoundService.pauseRound(pause);
        return super.doSuccess(res, `Round has been ${pause ? "Paused" : "Resumed"}.`);
    }

    @Get("/currentActiveRound")
    @Authorize("login")
    @Security("login")
    @Returns(StatusCodes.OK, SubmissionRoundModel)
    @Returns(StatusCodes.NOT_FOUND, NotFound)
    public async getActiveRound(): Promise<unknown> {
        const activeRound = await this.submissionRoundService.getCurrentActiveSubmissionRound();
        if (!activeRound) {
            throw new NotFound("No submission rounds are currently active.");
        }
        return activeRound;
    }

    @Get("/getAllRounds")
    @Authorize("login")
    @Security("login")
    @Returns(StatusCodes.OK, Array).Of(SubmissionRoundModel)
    public getAllRounds(@Res() res: PlatformResponse, @QueryParams("includeActive") includeActive: boolean): unknown {
        return this.submissionRoundService.getAllSubmissionRounds(includeActive);
    }

    @Delete("/:roundId/deleteRound")
    @Authorize("login")
    @Security("login")
    @Returns(StatusCodes.OK, SuccessModel)
    @Returns(StatusCodes.BAD_REQUEST, BadRequest)
    public async deleteRound(@Res() res: PlatformResponse, @PathParams("roundId") roundId: number): Promise<unknown> {
        try {
            const result = await this.submissionRoundService.deleteRound(roundId);
            if (result) {
                return super.doSuccess(res, `Round ${roundId} has been deleted`);
            }
        } catch (e) {
            throw new BadRequest(e.message);
        }
        throw new BadRequest("Unable to delete round");
    }
}
