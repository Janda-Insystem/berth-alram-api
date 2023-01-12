import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { container } from "src/models";
import { Utils } from "src/util/common.utils";
import { ContainersReposiotry } from "./containers.repository";
import { CreateContainerDto } from "./dto/create-container.dto";
import { DeleteContainerDto } from "./dto/delete-container.dto";
import { DynamicUpdateContainerDangerStatusDto } from "./dto/dynamic-update-container-danger-status.dto";
import { DynamicUpdateContainerStatus } from "./dto/dynamic-update-container-status.dto";

@Injectable()
export class ContainersService {
  constructor(
    private readonly seqeulize: Sequelize,
    private readonly utils: Utils,
    private readonly containersRepository: ContainersReposiotry
  ) {}

  /** 컨테이너 검색 시 create && select */
  async createContainers(containerDto: Array<CreateContainerDto>) {
    const t = await this.seqeulize.transaction();
    try {
      for (const containers of containerDto) {
        const CON_OID = await this.utils.getOid(container, "container");
        await container.create(
          { oid: CON_OID, ...containers },
          { transaction: t }
        );
      }

      await t.commit();

      /** 해당 조건으로 데이터 보여주기 */
      const newContainerList = containerDto.map(async (value) => {
        const newContainerSelectList = await this.containersRepository.findAll({
          berthOid: value.berthOid,
          alramOid: value.alramOid,
        });

        return newContainerSelectList;
      });

      if (newContainerList.length > 0) {
        return newContainerList;
      } else {
        await t.rollback();
        throw new InternalServerErrorException(
          "데이터를 저장하는 데에 오류가 생겼습니다."
        );
      }
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw new InternalServerErrorException(`${error}`);
    }
  }

  /** 컨테이너 삭제 */
  async deleteContainers(data: DeleteContainerDto) {
    const t = await this.seqeulize.transaction();
    try {
      for (const obj of data.oid) {
        await container.destroy({ where: { oid: obj }, transaction: t });
      }
      await t.commit();
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw new InternalServerErrorException("데이터 삭제 실패");
    }
  }

  /** 컨테이너의 반입/대기 status 사용자화 로직 */
  async dynamicUpdateContainerStatus(
    containerData: DynamicUpdateContainerStatus
  ) {
    const t = await this.seqeulize.transaction();
    try {
      await container.update(
        { ...containerData },
        {
          where: { oid: containerData.oid },
          transaction: t,
        }
      );

      const result = await t.commit();
      return result;
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw new InternalServerErrorException(
        `${error}\ncontainer status change error!`
      );
    }
  }

  /** 위험물/일반 상태 변경 함수 */
  async dynamicUpdateContainerIsDangerStatus(
    data: DynamicUpdateContainerDangerStatusDto
  ) {
    const t = await this.seqeulize.transaction();
    try {
      await container.update(
        { isDanger: data.isDanger },
        { where: { oid: data.oid }, transaction: t }
      );

      const result = await t.commit();
      return result;
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw new InternalServerErrorException(
        `${error}\ncontainer isDanger status change error!`
      );
    }
  }
}
