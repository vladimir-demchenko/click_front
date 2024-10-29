import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Typography, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useParams } from 'react-router-dom'
import { useTimer } from 'react-timer-hook';

function getDiff(end: string) {
  switch (end) {
    case "09:00":
      return dayjs().hour(9).minute(0).second(0).locale('ru')
    case "17:00":
      return dayjs().hour(17).minute(0).second(0).locale('ru')
    case "00:00":
      return dayjs().hour(23).minute(59).second(59).locale('ru')

    default:
      return dayjs().hour(9).minute(0).second(0).locale('ru')
  }
}

export const ProxyPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient()
  const [clickData, setClickData] = useState<Record<any, any>>({});
  const [shouldClear, setShouldClear] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const API_URL = 'http://38.180.109.78:8000'
  // const API_URL = 'http://localhost:8000'
  const { data: client, isLoading } = useQuery({
    queryKey: ['proxy'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/clients/${Number(id)}`
      )
      return data
    }
  });

  // const { data: config } = useQuery({
  //   queryKey: ['config'],
  //   queryFn: async () => {
  //     const { data } = await axios.get(
  //       `${API_URL}/config`
  //     )
  //     return data
  //   },
  //   refetchInterval: 30000
  // });

  const { totalSeconds, restart } = useTimer({ expiryTimestamp: dayjs().toDate() })
  const clickMutation = useMutation({
    mutationFn: (data: { id: number }) => axios.patch(API_URL + `/take/${data.id}`),
    onSuccess: (data) => {
      if (data.data.status === 'Fail') {
        messageApi.error(data.data.message)
        if (data.data?.time) {
          restart(dayjs.unix(data.data?.time).locale('ru').toDate())
        }
      }
      else {
        // restart(dayjs().add(Math.ceil(getDiff(config?.interval.split("-")[1]).diff(dayjs().locale('ru'), "seconds") / (proxy?.targetClicks - proxy?.clicks)), "seconds").toDate())
        setClickData(data.data)
        setShouldClear(true)
        queryClient.invalidateQueries({ queryKey: ['config'] })
        queryClient.invalidateQueries({ queryKey: ['proxy'] })
        messageApi.success(data.statusText)
      }

    }
  })
  const browserApi = useMutation({
    mutationFn: (data: { id: number, body: Record<string, string> }) => axios.patch(API_URL + `/clients/${data.id}`, { name: client.name, browser_api: data.body?.browser_api }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['config'] })
      queryClient.invalidateQueries({ queryKey: ['proxy'] })
      messageApi.success(data.statusText)
    }
  })
  const regex = /^http:\/\/([^:]+:[^@]+)@([^:]+:[^/]+)/

  const deleteProfile = useMutation({
    mutationFn: (data: { id: number, proxy_id: any, browser_proxy_id: any, profile_id: any }) => axios.patch(API_URL + `/untake/${data.id}?profile_id=${data.profile_id}&browser_proxy_id=${data.browser_proxy_id}&proxy_id=${data.proxy_id}`),
    onSuccess: () => {
      setShouldClear(false)
      messageApi.success('OK')
    }
  })

  const handleClick = () => {
    clickMutation.mutate({ id: Number(id) })
  }

  const handleDeleteProfile = () => {
    deleteProfile.mutate({ id: Number(id), profile_id: clickData.result.profile.browserProfileId, browser_proxy_id: clickData.result.browser_proxy.data.id, proxy_id: clickData.result.proxy.id })
  }

  return (
    <div style={{ padding: 40 }}>
      {contextHolder}
      <Flex vertical gap={20}>
        {/*<Flex gap={100}>
          <Flex vertical gap={10}>
            <span>IP: <Typography.Text copyable>{proxy?.url.match(regex)[2].split(':')[0]}</Typography.Text></span>
            <span>Port: <Typography.Text copyable>{proxy?.url.match(regex)[2].split(':')[1]}</Typography.Text></span>
            <span>Login: <Typography.Text copyable>{proxy?.url.match(regex)[1].split(':')[0]}</Typography.Text></span>
            <span>Password: <Typography.Text copyable>{proxy?.url.match(regex)[1].split(':')[1]}</Typography.Text></span>
            <span><Typography.Text copyable>{proxy?.change_ip}</Typography.Text></span>
            <a href='https://dolphin-anty.com/panel/#/api' target='_blank'>Получить токен браузера</a>
          </Flex>
          <Flex vertical gap={10}>
            <span>Текущий интервал {config?.interval}</span>
            <span>Количество кликов - {proxy?.clicks} / {proxy?.targetClicks}</span>
            <span>Следующий клик через {totalSeconds} секунд</span>
          </Flex>
        </Flex>*/}
        <a href='https://dolphin-anty.com/panel/#/api' target='_blank'>Получить токен браузера</a>
        <Flex vertical>
          <Form
            layout='vertical'
            onFinish={(values) => browserApi.mutate({ id: Number(id), body: values })}
          >
            <Form.Item initialValue={client?.browser_api} name='browser_api'><Input placeholder='Токен браузера' /></Form.Item>
            <Form.Item><Button htmlType='submit'>Сохранить</Button></Form.Item>
          </Form>
          <Button disabled={shouldClear} loading={clickMutation.isPending} onClick={handleClick}>Поменять ip</Button>
          <Button disabled={!shouldClear} loading={deleteProfile.isPending} onClick={handleDeleteProfile} danger>Удалить профиль</Button>
        </Flex>
      </Flex>
    </div>
  )
}