import { ExtendableContext } from 'koa';
import fetch from 'node-fetch';
import { RouterContext } from '@koa/router';
import { getManager, Repository, getRepository, Between, Like } from 'typeorm';
import { GatherData } from '../entity/ybb1/gatherdata';
import { FisheryWaterQuality } from '../entity/ybb2/fisherywaterquality';
import { FisheryFisherman } from '../entity/ybb2/fisheryfisherman';
import { FisheryFisheryEquipment } from '../entity/ybb2/fisheryfisheryequipment';
import { ExpoAgriProductPrice } from '../entity/archive/expoAgriProductPrice';

import { config } from '../config';
import moment from 'moment';
// import moment from 'moment';

const { wxAppId, wxAppSecret } = config;
// const AppID = 'wxb4af199fd96d40b0';
// const AppSecret = 'c403d09ec6dfee89c36d8a53e82a4ed3';

function roundFun(value: number, n: number): number {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

type reqData = {
    user: string;
    type: string;
    images: Array<string>;
    SN: string;
    location: [number, number];
};

export const upload = async (ctx: ExtendableContext): Promise<void> => {
    ctx.body = {
        path: ctx.request.files[0].path
            .replace(/\\/g, '/')
            .replace(config.uploadDest, ''),
    };
};

export const updata = async (ctx: RouterContext): Promise<void> => {
    const { location, type, SN, images, user, appid } = ctx.request.body;
    const time = new Date();
    const maplocation = [roundFun(location[0], 6), roundFun(location[1], 6)];
    const adcode = await fetch(
        `https://restapi.amap.com/v3/geocode/regeo?key=${config.mapkey}&location=${maplocation[1]},${maplocation[0]}`,
        { method: 'GET' },
    ).then((res) => {
        return res.json();
    });
    const repo: Repository<GatherData> = getManager('ybb1').getRepository(
        GatherData,
    );
    let data = await repo.findOne({
        where: { SN },
    });
    if (!data) {
        data = new GatherData();
    }
    data.SN = SN;
    data.images = images;
    data.location = location;
    data.type = type;
    data.user = user;
    data.appid = appid;
    data.adcode = adcode.regeocode.addressComponent.adcode;
    data.time = time;
    const result = await repo.save(data);
    ctx.body = result;
};

export const list = async (ctx: RouterContext): Promise<void> => {
    const { appid, page, size } = ctx.request.query;
    const repo: Repository<GatherData> = getManager('ybb1').getRepository(
        GatherData,
    );
    const [data, total] = await repo.findAndCount({
        where: { appid },
        skip: (page - 1) * size,
        take: size,
    });
    ctx.body = { data, total };
};

export const getid = async (ctx: RouterContext): Promise<void> => {
    const code = ctx.request.query.code;
    const token = await fetch(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${wxAppId}&secret=${wxAppSecret}&js_code=${code}&grant_type=authorization_code`,
        {
            method: 'GET',
        },
    ).then((res) => {
        return res.json();
    });
    const openid = token.openid;
    ctx.body = { id: openid };
};

export const getlocation = async (ctx: RouterContext): Promise<void> => {
    const data = await getRepository(GatherData, 'ybb1')
        .createQueryBuilder('gatherdata')
        .select([
            'gatherdata.id',
            'gatherdata.type',
            'gatherdata.SN',
            'gatherdata.location',
        ])
        .getMany();
    ctx.body = data;
};

export const getlist = async (ctx: RouterContext): Promise<void> => {
    const { id } = ctx.request.query;
    const repo: Repository<GatherData> = getManager('ybb1').getRepository(
        GatherData,
    );
    const result = await repo.findOne({
        where: { id },
    });
    ctx.body = result;
};

export const chartData = async (ctx: RouterContext): Promise<void> => {
    const repo: Repository<GatherData> = getManager('ybb1').getRepository(
        GatherData,
    );
    const [data1, total1] = await repo.findAndCount({
        where: {
            type: '摄像头',
        },
    });
    const [data2, total2] = await repo.findAndCount({
        where: {
            type: '控制器',
        },
    });
    console.log(data1, total2);
    ctx.body = {
        cameraData: data1,
        cameraTotal: total1,
        monitorData: data2,
        monitorTotal: total2,
    };
};

export const getDistributionArea = async (
    ctx: RouterContext,
): Promise<void> => {
    ctx.body = [
        { name: '江岸区', area: 480, product: 26000 },
        { name: '江汉区', area: 420, product: 13000 },
        { name: '洪山区', area: 350, product: 31000 },
        { name: '江夏区', area: 300, product: 25000 },
        { name: '黄陂区', area: 240, product: 28000 },
        { name: '蔡甸区', area: 160, product: 10000 },
        { name: '新洲区', area: 100.12, product: 10000 },
    ];
};

export const waterQualityCharts = async (ctx: RouterContext): Promise<void> => {
    const { equipmentid, beginTime, endTime } = ctx.request.body;
    const repo: Repository<FisheryWaterQuality> = getManager(
        'ybb2',
    ).getRepository(FisheryWaterQuality);
    const data = await repo.find({
        select: ['dissolved_oxygen', 'temperature', 'ph', 'etime'],
        where: {
            equipment_id: equipmentid,
            etime: Between(new Date(beginTime), new Date(endTime)),
        },
        order: {
            etime: 'ASC',
        },
    });
    ctx.body = data;
};

export const hasWaterQuality = async (ctx: RouterContext): Promise<void> => {
    const { id } = ctx.request.query;
    const repo: Repository<FisheryWaterQuality> = getManager(
        'ybb2',
    ).getRepository(FisheryWaterQuality);
    const data = await repo.count({
        where: {
            equipment_id: id,
        },
    });
    ctx.body = data > 0;
};

export const queryTotal = async (ctx: RouterContext): Promise<void> => {
    const repo1: Repository<FisheryFisherman> = getManager(
        'ybb2',
    ).getRepository(FisheryFisherman);
    const repo2: Repository<FisheryFisheryEquipment> = getManager(
        'ybb2',
    ).getRepository(FisheryFisheryEquipment);
    const ybbUser = await repo1.count();
    const ybbEquipment = await repo2.count();
    ctx.body = {
        ybbUser,
        ybbEquipment,
    };
};

export const getPrice = async (ctx: RouterContext): Promise<void> => {
    const { starttime, endtime, where } = ctx.request.body;
    // console.log({recordtime: [starttime, endtime],...where});
    const repo: Repository<ExpoAgriProductPrice> = getManager(
        'archive',
    ).getRepository(ExpoAgriProductPrice);
    const data = await repo.find({
        where: {
            recordtime: Between(starttime, endtime),
            ...where,
            market_code: Like('42%'),
            farm_prod_code: Like('AM%'),
        },
        order: {
            recordtime: 'ASC',
        },
        select: [
            'recordtime',
            'farm_prod_name',
            'market_name',
            'price_avg',
            'price_max',
            'price_min',
            'rid',
        ],
    });
    console.log(data);
    ctx.body = data;
};
export const waterQualityList = async (ctx: RouterContext): Promise<void> => {
    const { equipmentid, pageSize, page, where } = ctx.request.body;
    const beginTime = moment(moment(where.etime).format('YYYY-MM-DD')).toDate();
    const endTime = moment(moment(where.etime).format('YYYY-MM-DD')).add(1,'d').subtract(1,'s').toDate();
    const repo: Repository<FisheryWaterQuality> = getManager(
        'ybb2',
    ).getRepository(FisheryWaterQuality);
    const [data, total] = await repo.findAndCount({
        select: ['dissolved_oxygen', 'temperature', 'ph', 'etime'],
        where: {
            equipment_id: equipmentid,
            etime: Between(new Date(beginTime), new Date(endTime)),
        },
        order: {
            etime: 'DESC',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
    });
    ctx.body = {
        result:data,
        total
    };
};