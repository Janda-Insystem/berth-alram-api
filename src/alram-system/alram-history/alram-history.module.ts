import { Module } from "@nestjs/common";
import { AlramHistoryService } from "./alram-history.service";
import { AlramHistoryController } from "./alram-history.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { alramHistory } from "src/models";
import { AlramHistoryRepository } from "./alram-history.repository";
import { Utils } from "src/util/common.utils";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    SequelizeModule.forFeature([alramHistory]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AlramHistoryController],
  providers: [AlramHistoryService, AlramHistoryRepository, Utils],
})
export class AlramHistoryModule {}
