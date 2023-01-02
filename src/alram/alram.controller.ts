import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { OffsetPagingInfoDto } from "src/dashboard/dto/offset-page-info.dto";
import { ErrorHandler } from "src/error-handler/error-handler";
import { AlramService } from "./alram.service";
import { CreateAlramDto } from "./dto/create-alram.dto";
import { RemoveAlramDto } from "./dto/remove-alram.dto";
import { TrminalCodeListDto } from "./dto/trminal-code-list.dto";
import { UpdateAlramDto } from "./dto/update-alram.dto";

@UseGuards(JwtAuthGuard)
@UseFilters(ErrorHandler)
@Controller("alram")
export class AlramController {
  constructor(private readonly alramService: AlramService) {}

  @Post("/")
  create(@Body() data: Array<CreateAlramDto>) {
    return this.alramService.create(data);
  }

  @Post("/page-info/:oid")
  findOne(
    @Param("oid") oid: string,
    @Body() pageInfo: OffsetPagingInfoDto,
    trminlCodeList: TrminalCodeListDto
  ) {
    return this.alramService.makePageInfoForAlramList(
      pageInfo,
      oid,
      trminlCodeList
    );
  }

  @Put("/")
  update(@Body() updateAlramDto: UpdateAlramDto) {
    return this.alramService.update(updateAlramDto);
  }

  @Delete("/:oid")
  remove(@Body() data: Array<RemoveAlramDto>) {
    return this.alramService.remove(data);
  }
}
