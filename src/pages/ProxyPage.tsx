import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Typography, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
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

  const [messageApi, contextHolder] = message.useMessage();
  const API_URL = 'http://206.188.196.107:8000'
  // const API_URL = 'http://localhost:8000'
  const { data: proxy, isLoading } = useQuery({
    queryKey: ['proxy'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/proxies/${Number(id)}`
      )
      return data
    }
  });

  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/config`
      )
      return data
    },
    refetchInterval: 30000
  });

  const { totalSeconds, restart } = useTimer({ expiryTimestamp: dayjs().toDate() })
  const clickMutation = useMutation({
    mutationFn: (data: { id: number }) => axios.post(API_URL + `/click/${data.id}`),
    onSuccess: (data) => {
      if (data.data.status === 'Fail') {
        messageApi.error(data.data.message)
        if (data.data?.time) {
          restart(dayjs.unix(data.data?.time).locale('ru').toDate())
        }
      }
      else {
        restart(dayjs().add((proxy?.targetClicks - proxy?.clicks) / getDiff(config?.interval.split("-")[1]).diff(dayjs().locale('ru'), "seconds"), "seconds").locale('ru').toDate())
        queryClient.invalidateQueries({ queryKey: ['config'] })
        queryClient.invalidateQueries({ queryKey: ['proxy'] })
        messageApi.success(data.statusText)
      }

    }
  })
  const browserApi = useMutation({
    mutationFn: (data: { id: number, body: Record<string, string> }) => axios.put(API_URL + `/browser_api/${data.id}`, data?.body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['config'] })
      queryClient.invalidateQueries({ queryKey: ['proxy'] })
      messageApi.success(data.statusText)
    }
  })
  const regex = /^http:\/\/([^:]+:[^@]+)@([^:]+:[^/]+)/

  const handleClick = () => {
    clickMutation.mutate({ id: Number(id) })
  }

  console.log(config?.interval.split("-")[1])

  return (
    <div style={{ padding: 40 }}>
      {contextHolder}
      <Flex vertical gap={20}>
        <Flex gap={100}>
          <Flex vertical gap={10}>
            <span>IP: <Typography.Text copyable>{proxy?.url.match(regex)[2].split(':')[0]}</Typography.Text></span>
            <span>Port: <Typography.Text copyable>{proxy?.url.match(regex)[2].split(':')[1]}</Typography.Text></span>
            <span>Login: <Typography.Text copyable>{proxy?.url.match(regex)[1].split(':')[0]}</Typography.Text></span>
            <span>Password: <Typography.Text copyable>{proxy?.url.match(regex)[1].split(':')[1]}</Typography.Text></span>
            {/* <span><Typography.Text copyable>{proxy?.change_ip}</Typography.Text></span> */}
            <a href='https://dolphin-anty.com/panel/#/api' target='_blank'>Получить токен браузера</a>
          </Flex>
          <Flex vertical gap={10}>
            <span>Текущий интервал {config?.interval}</span>
            <span>Количество кликов - {proxy?.clicks} / {proxy?.targetClicks}</span>
            <span>Следующий клик через {totalSeconds} секунд</span>
          </Flex>
        </Flex>

        <Flex vertical>
          <Form
            layout='vertical'
            onFinish={(values) => browserApi.mutate({ id: Number(id), body: values })}
          >
            <Form.Item initialValue={proxy?.browser_api} name='browser_api'><Input placeholder='Токен браузера' /></Form.Item>
            <Form.Item><Button htmlType='submit'>Сохранить</Button></Form.Item>
          </Form>
          <Button loading={clickMutation.isPending} onClick={handleClick}>Поменять ip</Button>
        </Flex>
      </Flex>
    </div>
  )
}