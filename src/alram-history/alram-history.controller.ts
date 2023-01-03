import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseFilters,
  Put,
} from "@nestjs/common";
import { ErrorHandler } from "src/error-handler/error-handler";
import { AlramHistoryRepository } from "./alram-history.repository";
import { AlramHistoryService } from "./alram-history.service";
import { UpdateAlramHistoryDto } from "./dto/update-alram-history.dto";

@UseFilters(ErrorHandler)
@Controller("alram-history")
export class AlramHistoryController {
  constructor(
    private readonly alramHistoryService: AlramHistoryService,
    private readonly alramHistoryRepository: AlramHistoryRepository
  ) {}

  @Get("/:oid")
  findOne(@Param("oid") oid: string) {
    return this.alramHistoryRepository.findOneOfUserAlramHistory(oid);
  }

  @Put("/")
  update(@Body() updateAlramHistoryDto: UpdateAlramHistoryDto) {
    return this.alramHistoryService.update(updateAlramHistoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.alramHistoryService.remove(+id);
  }
}
